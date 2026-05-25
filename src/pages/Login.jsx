import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../stores/authStore";

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const startLogin = useAuthStore((s) => s.startLogin);
  const authError = useAuthStore((s) => s.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await startLogin({ email });
    setIsLoading(false);

    if (res.next === "emailOtp") {
      navigate('/verify-email', { replace: true });
      return;
    }

    return;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_50px_rgba(0,255,122,0.10)] backdrop-blur">
        <div>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00ff7a] text-xl font-extrabold text-black shadow-[0_0_32px_rgba(0,255,122,0.25)]">
            ₦
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Log in to SMC Workflow
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-white/60">
            Enter your email to continue
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white/75">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm font-semibold text-white placeholder-white/35 outline-none transition focus:border-[#00ff7a66] focus:ring-2 focus:ring-[#00ff7a33]"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          {authError && (
            <div className="text-sm font-semibold text-[#ff5454]">
              {authError}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#00ff7a] px-4 py-3 text-sm font-extrabold text-black shadow-[0_0_32px_rgba(0,255,122,0.18)] transition hover:shadow-[0_4px_40px_rgba(0,255,122,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Sending code...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
