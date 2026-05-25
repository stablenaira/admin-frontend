#!/usr/bin/env bash
# deploy.sh — Build and deploy admin-frontend to /opt/snr/frontend
# Usage: ./deploy.sh [--force] [--branch <branch>] [--repo <git-url>]
# Options:
#   --force          Deploy even if the commit is already deployed
#   --branch <name>  Branch to deploy (default: main)
#   --repo <url>     Git repository URL (required on first run)

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────
DEPLOY_DIR="/opt/snr/frontend"
LOCK_FILE="/opt/snr/.deploy.lock"
STATE_FILE="/opt/snr/.deploy-state"
NODE_VERSION_REQUIRED=""  # resolved at runtime to latest LTS
FORCE=false

# ─── Argument parsing ─────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)  FORCE=true; shift ;;
    *)        echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ─── Helpers ──────────────────────────────────────────────────────────────────
log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2; }
err()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2; }
die()  { err "$*"; exit 1; }

cleanup() {
  local exit_code=$?
  rm -f "$LOCK_FILE"
  if [[ $exit_code -ne 0 ]]; then
    err "Deployment failed (exit $exit_code)."
    # Only remove work dir if it was a temp clone, not the repo itself
    [[ "$WORK_DIR" != "$SCRIPT_DIR" ]] && rm -rf "$WORK_DIR"
    # Remove any half-written staging artifacts
    rm -rf "${DEPLOY_DIR}.staging" "${DEPLOY_DIR}.old"
  fi
}

acquire_lock() {
  if [[ -e "$LOCK_FILE" ]]; then
    local pid
    pid=$(cat "$LOCK_FILE" 2>/dev/null || true)
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      die "Another deployment is in progress (PID $pid). Aborting."
    else
      log "Stale lock file found. Removing."
      rm -f "$LOCK_FILE"
    fi
  fi
  echo "$$" > "$LOCK_FILE"
}

# ─── Dependency installation ──────────────────────────────────────────────────
detect_pkg_manager() {
  if command -v apt-get &>/dev/null; then echo "apt"
  elif command -v dnf &>/dev/null;     then echo "dnf"
  elif command -v yum &>/dev/null;     then echo "yum"
  elif command -v apk &>/dev/null;     then echo "apk"
  else die "No supported package manager found (apt/dnf/yum/apk). Install dependencies manually."; fi
}

install_pkg() {
  local pkg="$1"
  local mgr
  mgr=$(detect_pkg_manager)
  log "Installing '$pkg' via $mgr..."
  case "$mgr" in
    apt) apt-get install -y -qq "$pkg" ;;
    dnf) dnf install -y -q  "$pkg" ;;
    yum) yum install -y -q  "$pkg" ;;
    apk) apk add --no-cache -q "$pkg" ;;
  esac
}

ensure_git() {
  command -v git &>/dev/null && return
  log "'git' not found — installing..."
  install_pkg git
  command -v git &>/dev/null || die "Failed to install git."
}

resolve_latest_lts() {
  # Query the Node.js release index and extract the major version of the latest LTS
  local raw lts_major

  raw=$(curl -fsSL --max-time 10 https://nodejs.org/dist/index.json 2>/dev/null || true)

  if [[ -n "$raw" ]]; then
    # Try python3 first (most reliable)
    lts_major=$(echo "$raw" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for r in data:
    if r.get('lts'):
        print(r['version'].lstrip('v').split('.')[0])
        break
" 2>/dev/null || true)

    # Fallback: awk — find first line where lts is not false, grab version field
    if [[ -z "$lts_major" ]]; then
      lts_major=$(echo "$raw" \
        | awk -F'"' '/"lts"/ && !/false/ { found=1 } found && /"version"/ { gsub(/v/,"",$4); split($4,a,"."); print a[1]; exit }' \
        2>/dev/null || true)
    fi
  fi

  if [[ -z "$lts_major" ]] || ! [[ "$lts_major" =~ ^[0-9]+$ ]]; then
    log "Warning: could not resolve latest LTS version. Falling back to Node.js 22."
    lts_major="22"
  fi

  echo "$lts_major"
}

install_node_lts() {
  local lts_major="$1"
  local mgr
  mgr=$(detect_pkg_manager)

  log "Installing Node.js $lts_major LTS..."

  # Prefer nvm for user-level installs; fall back to NodeSource for system installs
  if command -v nvm &>/dev/null || [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    # shellcheck source=/dev/null
    [[ -s "$HOME/.nvm/nvm.sh" ]] && source "$HOME/.nvm/nvm.sh"
    nvm install --lts
    nvm use --lts
    nvm alias default 'lts/*'
  else
    install_pkg curl
    case "$mgr" in
      apt)
        curl -fsSL "https://deb.nodesource.com/setup_${lts_major}.x" | bash -
        apt-get install -y -qq nodejs
        ;;
      dnf|yum)
        curl -fsSL "https://rpm.nodesource.com/setup_${lts_major}.x" | bash -
        "$mgr" install -y nodejs
        ;;
      apk)
        # Alpine: install latest available nodejs from community repo
        apk add --no-cache nodejs npm
        ;;
    esac
  fi
}

ensure_node() {
  # Resolve latest LTS major version
  install_pkg curl 2>/dev/null || true  # curl needed to resolve LTS
  local lts_major
  lts_major=$(resolve_latest_lts)
  NODE_VERSION_REQUIRED="$lts_major"
  log "Target Node.js version: $lts_major LTS"

  local need_install=false

  if ! command -v node &>/dev/null; then
    log "Node.js not found — installing..."
    need_install=true
  else
    local node_major
    node_major=$(node --version | sed 's/v//' | cut -d. -f1)
    if (( node_major < lts_major )); then
      log "Node.js $node_major found but latest LTS is $lts_major — upgrading..."
      need_install=true
    fi
  fi

  if [[ "$need_install" == true ]]; then
    install_node_lts "$lts_major"
  fi

  command -v node &>/dev/null || die "Failed to install Node.js."
  local installed_major
  installed_major=$(node --version | sed 's/v//' | cut -d. -f1)
  (( installed_major >= lts_major )) || die "Node.js >= $lts_major required, found $installed_major after install attempt."
  log "Node.js $(node --version) ready."
}

ensure_npm() {
  # npm ships with Node from NodeSource; this catches edge cases (e.g. apk split packages)
  if ! command -v npm &>/dev/null; then
    log "'npm' not found — installing..."
    install_pkg npm
    command -v npm &>/dev/null || die "Failed to install npm."
  fi
  log "npm $(npm --version) ready."
}

# ─── Preflight checks ─────────────────────────────────────────────────────────
preflight() {
  # Must run as root (or with sudo) to install system packages
  if [[ $EUID -ne 0 ]]; then
    log "Warning: not running as root. Dependency installation may fail if packages are missing."
  fi

  ensure_git
  ensure_node
  ensure_npm

  mkdir -p /opt/snr
  mkdir -p "$DEPLOY_DIR"
}

# ─── Resolve source directory ────────────────────────────────────────────────
# The script lives inside the repo — no cloning needed.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

fetch_source() {
  # Verify this is actually a git repo
  git -C "$SCRIPT_DIR" rev-parse --git-dir &>/dev/null \
    || die "$SCRIPT_DIR is not a git repository."

  log "Using local repository at $SCRIPT_DIR (branch: $(git -C "$SCRIPT_DIR" rev-parse --abbrev-ref HEAD))"

  # Warn if there are uncommitted changes
  if ! git -C "$SCRIPT_DIR" diff --quiet HEAD 2>/dev/null; then
    log "Warning: working tree has uncommitted changes — deploying current state."
  fi

  # Point WORK_DIR at the repo itself (no copy needed; build output goes to dist/)
  WORK_DIR="$SCRIPT_DIR"
}

# ─── Idempotency check ────────────────────────────────────────────────────────
check_idempotency() {
  local commit
  commit=$(git -C "$WORK_DIR" rev-parse HEAD 2>/dev/null) \
    || die "Failed to read HEAD commit from $WORK_DIR."
  log "Commit to deploy: $commit"

  if [[ -f "$STATE_FILE" ]]; then
    local deployed_commit
    deployed_commit=$(cat "$STATE_FILE")
    if [[ "$deployed_commit" == "$commit" ]]; then
      if [[ "$FORCE" == true ]]; then
        log "--force specified. Re-deploying commit $commit."
      else
        log "Commit $commit is already deployed. Use --force to redeploy. Exiting."
        exit 0
      fi
    fi
  fi

  DEPLOY_COMMIT="$commit"
}

# ─── Build ────────────────────────────────────────────────────────────────────
build() {
  log "Installing dependencies..."
  npm ci --prefix "$WORK_DIR"

  log "Building..."
  npm run build --prefix "$WORK_DIR"

  local dist_dir="$WORK_DIR/dist"
  [[ -d "$dist_dir" ]] || die "Build succeeded but dist/ directory not found at $dist_dir."
}

# ─── Atomic swap ──────────────────────────────────────────────────────────────
swap_in() {
  local commit="$1"
  local dist_dir="$WORK_DIR/dist"
  local timestamp
  timestamp=$(date '+%Y%m%d%H%M%S')
  local backup_dir="/opt/snr/frontend-backup-$timestamp"

  # Back up current deployment if it exists and has content
  if [[ -d "$DEPLOY_DIR" ]] && [[ -n "$(ls -A "$DEPLOY_DIR" 2>/dev/null)" ]]; then
    log "Backing up current deployment to $backup_dir..."
    cp -a "$DEPLOY_DIR" "$backup_dir"
  fi

  log "Swapping in new build..."
  # Atomic-ish: copy then replace to minimise downtime
  local staging="${DEPLOY_DIR}.staging"
  cp -a "$dist_dir" "$staging"

  # Swap directories
  local old="${DEPLOY_DIR}.old"
  if [[ -d "$DEPLOY_DIR" ]]; then
    mv "$DEPLOY_DIR" "$old"
  fi
  mv "$staging" "$DEPLOY_DIR"
  rm -rf "$old"

  # Record deployed commit
  echo "$commit" > "$STATE_FILE"
  log "Deployment complete. Commit $commit is live at $DEPLOY_DIR."

  # Prune old backups (keep last 3)
  # shellcheck disable=SC2012
  ls -dt /opt/snr/frontend-backup-* 2>/dev/null | tail -n +4 | xargs rm -rf --
}

# ─── Main ─────────────────────────────────────────────────────────────────────
main() {
  log "=== Starting deployment ==="

  preflight
  acquire_lock
  trap cleanup EXIT

  fetch_source
  DEPLOY_COMMIT=""
  check_idempotency

  build
  swap_in "$DEPLOY_COMMIT"

  log "=== Deployment finished successfully ==="
}

main
