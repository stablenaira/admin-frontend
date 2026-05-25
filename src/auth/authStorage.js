const STORAGE_KEY = "snr_session";
const ADMINS_KEY = "snr_admins";
const USER_SETTINGS_KEY = "snr_user_settings";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function loadSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession({ token, user }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function loadAdminEmails() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ADMINS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEmail).filter(Boolean);
  } catch {
    return [];
  }
}

export function saveAdminEmails(emails) {
  if (typeof window === "undefined") return;
  const list = Array.isArray(emails) ? emails.map(normalizeEmail).filter(Boolean) : [];
  window.localStorage.setItem(ADMINS_KEY, JSON.stringify(Array.from(new Set(list))));
}

export function addAdminEmail(email) {
  const e = normalizeEmail(email);
  if (!e) return false;
  const next = Array.from(new Set([...loadAdminEmails(), e]));
  saveAdminEmails(next);
  return true;
}

export function removeAdminEmail(email) {
  const e = normalizeEmail(email);
  const next = loadAdminEmails().filter((x) => x !== e);
  saveAdminEmails(next);
}

export function loadUserSettings(email) {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_SETTINGS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const e = normalizeEmail(email);
    if (!e || !parsed?.[e]) return null;
    return parsed[e];
  } catch {
    return null;
  }
}

export function saveUserSettings(email, patch) {
  if (typeof window === "undefined") return;
  const e = normalizeEmail(email);
  if (!e) return;
  let parsed = {};
  try {
    parsed = JSON.parse(window.localStorage.getItem(USER_SETTINGS_KEY) || "{}") || {};
  } catch {
    parsed = {};
  }
  const prev = parsed[e] || {};
  const next = { ...prev, ...patch };
  window.localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify({ ...parsed, [e]: next }));
}

