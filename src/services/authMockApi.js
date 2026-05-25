import { loadAdminEmails, loadUserSettings } from "../auth/authStorage";

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    if (!signal) return;
    if (signal.aborted) {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function randomId(prefix) {
  const s = Math.random().toString(16).slice(2);
  return `${prefix}_${Date.now().toString(16)}_${s}`;
}

function maskEmail(email) {
  const [name, domain] = String(email).split("@");
  if (!domain) return email;
  const head = name.slice(0, 2);
  return `${head}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

function makeJwt({ sub, email }) {
  const payload = { sub, email, iat: Math.floor(Date.now() / 1000) };
  const json = JSON.stringify(payload);
  const base64 = typeof btoa === "function" ? btoa(json) : Buffer.from(json, "utf8").toString("base64");
  return `mock.${base64}.signature`;
}

function isAdminEmailHeuristic(email) {
  const e = String(email || "").toLowerCase();
  const local = e.split("@")[0] || "";
  return local === "admin" || local.startsWith("admin+") || local.endsWith("+admin") || local.includes(".admin");
}

function isAdminEmail(email) {
  if (typeof window === "undefined") return isAdminEmailHeuristic(email);
  const e = String(email || "").trim().toLowerCase();
  const fromList = loadAdminEmails().includes(e);
  return fromList || isAdminEmailHeuristic(e);
}

const emailOtpChallenges = new Map();
const totpChallenges = new Map();

export async function authStartLogin({ email, signal }) {
  await delay(550, signal);

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    const err = new Error("Please enter your email");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
    const err = new Error("Please enter a valid email");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  const user = {
    id: "user_01",
    email: normalizedEmail,
    displayName: (loadUserSettings(normalizedEmail)?.displayName || "").trim() || (isAdminEmail(normalizedEmail) ? "Admin" : "User"),
    isAdmin: isAdminEmail(normalizedEmail),
    twoFactorEnabled: Boolean(loadUserSettings(normalizedEmail)?.twoFactorEnabled ?? true),
  };

  const challengeId = randomId("email");
  emailOtpChallenges.set(challengeId, { user, createdAt: Date.now(), expiresAt: Date.now() + 5 * 60 * 1000 });

  return {
    requiresEmailOtp: true,
    challengeId,
    maskedEmail: maskEmail(normalizedEmail),
    delivery: "email",
  };
}

export async function authVerifyEmailOtp({ challengeId, code, signal }) {
  await delay(520, signal);

  const ch = emailOtpChallenges.get(challengeId);
  if (!ch) {
    const err = new Error("Login session expired. Please log in again.");
    err.code = "CHALLENGE_NOT_FOUND";
    throw err;
  }

  if (Date.now() > ch.expiresAt) {
    emailOtpChallenges.delete(challengeId);
    const err = new Error("Login session expired. Please log in again.");
    err.code = "CHALLENGE_EXPIRED";
    throw err;
  }

  const normalized = String(code || "").trim();
  if (!/^\d{6}$/.test(normalized)) {
    const err = new Error("Enter a 6-digit code");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  if (normalized !== "111111") {
    const err = new Error("Invalid verification code. Try again.");
    err.code = "INVALID_EMAIL_OTP";
    throw err;
  }

  emailOtpChallenges.delete(challengeId);

  if (ch.user.isAdmin && ch.user.twoFactorEnabled) {
    const totpChallengeId = randomId("totp");
    totpChallenges.set(totpChallengeId, { user: ch.user, createdAt: Date.now(), expiresAt: Date.now() + 5 * 60 * 1000 });
    return {
      requiresTotp: true,
      challengeId: totpChallengeId,
      maskedEmail: maskEmail(ch.user.email),
      method: "TOTP",
      user: { id: ch.user.id, email: ch.user.email, displayName: ch.user.displayName, isAdmin: true },
    };
  }

  return { requiresTotp: false, token: makeJwt({ sub: ch.user.id, email: ch.user.email }), user: ch.user };
}

export async function authVerifyTotp({ challengeId, code, signal }) {
  await delay(520, signal);

  const ch = totpChallenges.get(challengeId);
  if (!ch) {
    const err = new Error("Login session expired. Please log in again.");
    err.code = "CHALLENGE_NOT_FOUND";
    throw err;
  }

  if (Date.now() > ch.expiresAt) {
    totpChallenges.delete(challengeId);
    const err = new Error("Login session expired. Please log in again.");
    err.code = "CHALLENGE_EXPIRED";
    throw err;
  }

  const normalized = String(code || "").trim();
  if (!/^\d{6}$/.test(normalized)) {
    const err = new Error("Enter a 6-digit code");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  if (normalized !== "123456") {
    const err = new Error("Invalid code. Try again.");
    err.code = "INVALID_TOTP";
    throw err;
  }

  totpChallenges.delete(challengeId);
  return { token: makeJwt({ sub: ch.user.id, email: ch.user.email }), user: ch.user };
}
