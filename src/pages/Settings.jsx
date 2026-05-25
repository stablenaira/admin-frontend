import { useMemo, useState } from "react";
import { Panel } from "../components/treasury/Panel";
import { useAuthStore } from "../stores/authStore";

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white/80">{label}</div>
        {hint ? <div className="text-xs font-semibold text-white/45">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm font-semibold text-white placeholder-white/35 outline-none transition focus:border-[#00ff7a66] focus:ring-2 focus:ring-[#00ff7a33] ${
        props.className || ""
      }`}
    />
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-[#00ff7a] px-4 py-3 text-sm font-extrabold text-black shadow-[0_0_32px_rgba(0,255,122,0.18)] transition hover:shadow-[0_4px_40px_rgba(0,255,122,0.24)] disabled:cursor-not-allowed disabled:opacity-60 ${
        props.className || ""
      }`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-extrabold text-white/75 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
        props.className || ""
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-14 items-center overflow-hidden rounded-full border transition ${
        checked ? "border-[#00ff7a55] bg-[#00ff7a]" : "border-white/10 bg-white/10"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full transition ${
          checked ? "translate-x-8 bg-black" : "translate-x-1 bg-white"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const adminEmails = useAuthStore((s) => s.adminEmails);
  const refreshAdminEmails = useAuthStore((s) => s.refreshAdminEmails);
  const addAdminEmail = useAuthStore((s) => s.addAdminEmail);
  const removeAdminEmail = useAuthStore((s) => s.removeAdminEmail);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const setTwoFactorEnabled = useAuthStore((s) => s.setTwoFactorEnabled);

  const isAdmin = Boolean(user?.isAdmin);
  const twoFactorEnabled = Boolean(user?.twoFactorEnabled);

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [adminEmail, setAdminEmail] = useState("");
  const canManageAdmins = isAdmin;

  const sortedAdmins = useMemo(() => {
    const list = Array.isArray(adminEmails) ? adminEmails : [];
    return [...list].sort((a, b) => a.localeCompare(b));
  }, [adminEmails]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1200px] space-y-6 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Settings</h1>
            <p className="mt-2 text-sm font-semibold text-white/60">Profile, security, and admin management</p>
          </div>
          <SecondaryButton onClick={refreshAdminEmails} disabled={isLoading}>
            Refresh
          </SecondaryButton>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#ff545433] bg-[#ff545412] px-4 py-3 text-sm font-semibold text-[#ff5454]">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel className="p-6">
            <div className="mb-5 text-lg font-extrabold tracking-tight">Profile</div>
            <div className="space-y-4">
              <Field label="Display name" hint="Visible in the sidebar">
                <TextInput value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
              </Field>
              <Field label="Email" hint="Read-only">
                <TextInput value={user?.email || ""} readOnly />
              </Field>

              <div className="flex items-center justify-end gap-2 pt-2">
                <PrimaryButton
                  disabled={isLoading}
                  onClick={() => updateProfile({ displayName: displayName.trim() })}
                  type="button"
                >
                  Save profile
                </PrimaryButton>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="mb-5 text-lg font-extrabold tracking-tight">Security</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-white">Two-factor authentication (TOTP)</div>
                  <div className="mt-1 text-sm font-semibold text-white/55">
                    Only applies to admin accounts. When enabled, admins must enter a TOTP code after email verification.
                  </div>
                </div>
                <Toggle checked={twoFactorEnabled} onChange={setTwoFactorEnabled} disabled={!isAdmin || isLoading} />
              </div>

              {!isAdmin ? (
                <div className="text-sm font-semibold text-white/45">You are not an admin, so TOTP is not required.</div>
              ) : null}
            </div>
          </Panel>
        </div>

        <Panel className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold tracking-tight">Admin Users</div>
              <div className="mt-1 text-sm font-semibold text-white/55">Add or remove admin accounts (admins may require TOTP).</div>
            </div>
            <div className={`text-xs font-extrabold ${canManageAdmins ? "text-[#00ff7a]" : "text-white/35"}`}>
              {canManageAdmins ? "Admin access" : "Read-only"}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <Field label="Add new admin" hint="Email">
                <div className="flex gap-2">
                  <TextInput value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="new-admin@company.com" />
                  <PrimaryButton
                    type="button"
                    disabled={!canManageAdmins || isLoading}
                    onClick={() => {
                      addAdminEmail(adminEmail).then((ok) => {
                        if (ok) setAdminEmail("");
                      });
                    }}
                  >
                    Add
                  </PrimaryButton>
                </div>
                <div className="mt-2 text-xs font-semibold text-white/45">Mock email code: 111111 · Admin TOTP: 123456</div>
              </Field>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <div className="mb-3 text-sm font-extrabold text-white">Current admins</div>
              <div className="space-y-2">
                {sortedAdmins.length ? (
                  sortedAdmins.map((e) => (
                    <div key={e} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <div className="min-w-0 truncate font-mono text-[12px] font-bold text-white/80">{e}</div>
                      <button
                        type="button"
                        disabled={!canManageAdmins || isLoading}
                        onClick={() => removeAdminEmail(e)}
                        className="rounded-lg border border-white/10 bg-white/6 px-2.5 py-1 text-xs font-extrabold text-white/75 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm font-semibold text-white/45">No admins configured yet.</div>
                )}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
