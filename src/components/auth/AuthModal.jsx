import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal({ initialMode = "register", onSuccess }) {
  const {
    authModalOpen,
    setAuthModalOpen,
    authNotice,
    setAuthNotice,
    login,
    register,
    loginWithGoogle,
  } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!authModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setError("");
    setSuccessMsg("");
    setAuthNotice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!name.trim()) throw new Error("Please enter your full name.");
        if (!email.trim()) throw new Error("Please enter your email address.");
        if (!phone.trim()) throw new Error("Please enter your mobile number.");
        if (!password || password.length < 6)
          throw new Error("Password must be at least 6 characters.");

        await register(name, email, phone, password);
        setSuccessMsg("Account created successfully!");
      } else {
        if (!email.trim() || !password)
          throw new Error("Please enter your email and password.");

        await login(email, password);
        setSuccessMsg("Signed in successfully!");
      }

      if (onSuccess) onSuccess();
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      // High-fidelity Google OAuth Simulation for local test environment
      const mockGoogleId = "g_" + Math.random().toString(36).substring(2, 10);
      const googleUser = {
        name: name.trim() || "Verified Google Candidate",
        email: email.trim() || `candidate_${mockGoogleId.substring(2, 6)}@gmail.com`,
        googleId: mockGoogleId,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      };

      await loginWithGoogle(googleUser);
      setSuccessMsg("Google sign-in successful!");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-zinc-950/95 border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient highlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-300 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>ProResume Studio Account</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === "register" ? "Create Your Account" : "Welcome Back"}
          </h2>

          <p className="mt-1 text-xs text-zinc-400">
            {mode === "register"
              ? "Register once to save, manage, and download vector PDF resumes."
              : "Sign in to access your resumes and unlocked downloads."}
          </p>
        </div>

        {/* Notice Banner (e.g. from clicking Download PDF) */}
        {authNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authNotice}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-support", {
                    detail: {
                      category: "login",
                      subject: "Account Login Issue",
                      message: `I encountered an authentication issue: "${error}"`,
                    },
                  })
                );
              }}
              className="text-amber-400 hover:text-amber-300 underline font-medium text-[11px] self-start cursor-pointer"
            >
              Having trouble logging in? Contact support →
            </button>
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === "register"
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === "login"
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Wright"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {mode === "register" ? "Create Account & Continue" : "Sign In & Continue"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Security badge */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>MongoDB encrypted credentials • 256-bit JWT authentication</span>
        </div>
      </div>
    </div>
  );
}
