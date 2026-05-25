import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const verifyEmailOtp = useAuthStore((s) => s.verifyEmailOtp);
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const challenge = useAuthStore((s) => s.challenge);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (index > 0 && !otp[index]) {
        const next = [...otp];
        next[index - 1] = "";
        setOtp(next);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    verifyEmailOtp({ code }).then((res) => {
      if (res.next === "done") {
        navigate("/dashboard", { replace: true });
        return;
      }
      if (res.next === "totp") {
        navigate("/verify-otp", { replace: true });
        return;
      }
      if (res.next === "login") {
        navigate("/login", { replace: true });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_50px_rgba(0,255,122,0.10)] backdrop-blur">
        <div>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00ff7a] text-xl font-extrabold text-black shadow-[0_0_32px_rgba(0,255,122,0.25)]">
            ✉
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">Verify your email</h2>
          <p className="mt-2 text-center text-sm font-medium text-white/60">
            Enter the 6-digit code sent to {challenge?.email ? `(${challenge.email})` : "your email"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} onPaste={handlePaste}>
          <div>
            <label className="block text-sm font-semibold text-white/75 mb-3">Verification code</label>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-12 rounded-xl border border-white/10 bg-black/60 text-center text-xl font-extrabold text-white outline-none transition focus:border-[#00ff7a66] focus:ring-2 focus:ring-[#00ff7a33]"
                  required
                />
              ))}
            </div>
          </div>

          {error ? <div className="text-sm font-semibold text-[#ff5454]">{error}</div> : null}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#00ff7a] px-4 py-3 text-sm font-extrabold text-black shadow-[0_0_32px_rgba(0,255,122,0.18)] transition hover:shadow-[0_4px_40px_rgba(0,255,122,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Verifying..." : "Confirm"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-white/60">
              Not you?{" "}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
                disabled={isLoading}
                className="font-semibold text-[#00ff7a] hover:text-[#00e570] focus:outline-none focus:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back to login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

