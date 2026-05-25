import { create } from "zustand";
import {
  addAdminEmail,
  clearSession,
  loadAdminEmails,
  loadSession,
  loadUserSettings,
  removeAdminEmail,
  saveSession,
  saveUserSettings,
} from "../auth/authStorage";
import { authStartLogin, authVerifyEmailOtp, authVerifyTotp } from "../services/authMockApi";

const initialState = {
  status: "anonymous",
  token: null,
  user: null,
  challenge: null,
  adminEmails: [],
  loading: false,
  error: null,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,

  hydrate() {
    const session = loadSession();
    const admins = loadAdminEmails();
    set({ adminEmails: admins });
    if (!session) return;
    const email = session.user?.email;
    const settings = email ? loadUserSettings(email) : null;
    const isAdmin = email ? admins.includes(String(email).toLowerCase()) : Boolean(session.user?.isAdmin);
    const mergedUser = {
      ...session.user,
      ...(settings || {}),
      isAdmin,
    };
    set({
      status: "authenticated",
      token: session.token,
      user: mergedUser || null,
      error: null,
    });
  },

  refreshAdminEmails() {
    set({ adminEmails: loadAdminEmails() });
  },

  async addAdminEmail(email) {
    const ok = addAdminEmail(email);
    set({ adminEmails: loadAdminEmails() });
    const current = get().user;
    if (current?.email && String(current.email).toLowerCase() === String(email || "").toLowerCase()) {
      const updated = { ...(current || {}), isAdmin: true };
      saveSession({ token: get().token, user: updated });
      set({ user: updated });
    }
    return ok;
  },

  async removeAdminEmail(email) {
    removeAdminEmail(email);
    set({ adminEmails: loadAdminEmails() });
    const current = get().user;
    if (current?.email && String(current.email).toLowerCase() === String(email || "").toLowerCase()) {
      const updated = { ...(current || {}), isAdmin: false, twoFactorEnabled: false };
      saveUserSettings(current.email, { twoFactorEnabled: false });
      saveSession({ token: get().token, user: updated });
      set({ user: updated });
    }
  },

  async startLogin({ email }) {
    set({ loading: true, error: null });
    try {
      const res = await authStartLogin({ email });
      set({
        status: "pendingEmailOtp",
        token: null,
        user: { email: res.maskedEmail },
        challenge: { type: "email", id: res.challengeId, email: res.maskedEmail, delivery: res.delivery },
        loading: false,
      });
      return { next: "emailOtp" };
    } catch (e) {
      set({ loading: false, error: e?.message || "Login failed" });
      return { next: "error" };
    }
  },

  async verifyEmailOtp({ code }) {
    const challengeId = get().challenge?.type === "email" ? get().challenge?.id : null;
    if (!challengeId) {
      set({ status: "anonymous", token: null, user: null, challenge: null, error: "Please log in again." });
      return { next: "login" };
    }

    set({ loading: true, error: null });
    try {
      const res = await authVerifyEmailOtp({ challengeId, code });
      if (res.requiresTotp) {
        set({
          status: "pendingTotp",
          token: null,
          user: res.user || { email: res.maskedEmail, isAdmin: true },
          challenge: { type: "totp", id: res.challengeId, method: res.method, email: res.maskedEmail },
          loading: false,
        });
        return { next: "totp" };
      }

      saveSession({ token: res.token, user: res.user });
      set({
        status: "authenticated",
        token: res.token,
        user: res.user,
        challenge: null,
        loading: false,
      });
      return { next: "done" };
    } catch (e) {
      const msg = e?.message || "Verification failed";
      const code = e?.code;
      if (code === "CHALLENGE_EXPIRED" || code === "CHALLENGE_NOT_FOUND") {
        set({ status: "anonymous", token: null, user: null, challenge: null, loading: false, error: msg });
        return { next: "login" };
      }
      set({ loading: false, error: msg });
      return { next: "error" };
    }
  },

  async verifyTotp({ code }) {
    const challengeId = get().challenge?.type === "totp" ? get().challenge?.id : null;
    if (!challengeId) {
      set({ status: "anonymous", token: null, user: null, challenge: null, error: "Please log in again." });
      return { next: "login" };
    }

    set({ loading: true, error: null });
    try {
      const res = await authVerifyTotp({ challengeId, code });
      saveSession({ token: res.token, user: res.user });
      set({
        status: "authenticated",
        token: res.token,
        user: res.user,
        challenge: null,
        loading: false,
      });
      return { next: "done" };
    } catch (e) {
      const msg = e?.message || "Verification failed";
      const code = e?.code;
      if (code === "CHALLENGE_EXPIRED" || code === "CHALLENGE_NOT_FOUND") {
        set({ status: "anonymous", token: null, user: null, challenge: null, loading: false, error: msg });
        return { next: "login" };
      }
      set({ loading: false, error: msg });
      return { next: "error" };
    }
  },

  async updateProfile({ displayName }) {
    const current = get().user;
    const token = get().token;
    if (!current?.email || !token) return false;
    const nextName = String(displayName || "").trim();
    saveUserSettings(current.email, { displayName: nextName });
    const updated = { ...current, displayName: nextName };
    saveSession({ token, user: updated });
    set({ user: updated });
    return true;
  },

  setTwoFactorEnabled(enabled) {
    const current = get().user;
    const token = get().token;
    if (!current?.email || !token) return;
    if (!current.isAdmin) return;
    const next = Boolean(enabled);
    saveUserSettings(current.email, { twoFactorEnabled: next });
    const updated = { ...current, twoFactorEnabled: next };
    saveSession({ token, user: updated });
    set({ user: updated });
  },

  logout() {
    clearSession();
    set({ ...initialState, adminEmails: loadAdminEmails() });
  },
}));
