import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../stores/authStore";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const verifyTotp = useAuthStore((s) => s.verifyTotp);
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const challenge = useAuthStore((s) => s.challenge);
  
  // Array of refs for the input fields
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // If a digit was entered and there is a next input, focus it
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // On backspace, clear current field and focus previous field
    if (e.key === 'Backspace') {
      if (index > 0 && !otp[index]) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      return;
    }
    
    verifyTotp({ code: otpValue }).then((res) => {
      if (res.next === "done") {
        navigate('/dashboard', { replace: true });
        return;
      }
      if (res.next === "login") {
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_50px_rgba(0,255,122,0.10)] backdrop-blur">
        <div>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00ff7a] text-xl font-extrabold text-black shadow-[0_0_32px_rgba(0,255,122,0.25)]">
            ✓
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Two-factor authentication
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-white/60">
            Enter the 6-digit code from your authenticator app {challenge?.email ? `(${challenge.email})` : ""}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} onPaste={handlePaste}>
          <div>
            <label className="block text-sm font-semibold text-white/75 mb-3">
              Authenticator code
            </label>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
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
          
          {error && (
            <div className="text-sm font-semibold text-[#ff5454]">
              {error}
            </div>
          )}
          {!error && otp.some(Boolean) && otp.join("").length < 6 ? (
            <div className="text-sm font-semibold text-white/45">Enter all 6 digits</div>
          ) : null}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#00ff7a] px-4 py-3 text-sm font-extrabold text-black shadow-[0_0_32px_rgba(0,255,122,0.18)] transition hover:shadow-[0_4px_40px_rgba(0,255,122,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-white/60">
              Having trouble?{' '}
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
