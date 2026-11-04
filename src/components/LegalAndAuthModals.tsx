import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Lock, 
  User, 
  Mail, 
  Key, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Cookie, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Crown
} from "lucide-react";
import { UserSession } from "../types";
import { useFirebaseAuth } from "../context/FirebaseAuthContext";

interface LegalAndAuthModalsProps {
  currentSession: UserSession;
  onSessionUpdated: (newSession: UserSession) => void;
  activeModal: "member-login" | "register" | "admin-login" | "privacy" | "terms" | "cookies" | "delete-account" | null;
  onCloseModal: () => void;
  onOpenModal: (modal: "member-login" | "register" | "admin-login" | "privacy" | "terms" | "cookies" | "delete-account") => void;
}

export const LegalAndAuthModals: React.FC<LegalAndAuthModalsProps> = ({
  currentSession,
  onSessionUpdated,
  activeModal,
  onCloseModal,
  onOpenModal
}) => {
  const { signInWithGoogle } = useFirebaseAuth();

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Status & feedback
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState<number | null>(null);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const newSession = await signInWithGoogle();
      if (newSession) {
        onSessionUpdated(newSession);
        onCloseModal();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Google Firebase Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cookie banner state
  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    try {
      return !localStorage.getItem("cv_cookie_consent");
    } catch {
      return false;
    }
  });

  // Handle countdown timer for rate-limiting
  useEffect(() => {
    if (lockoutCountdown === null || lockoutCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockoutCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutCountdown]);

  // Reset form errors when switching modals
  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
    setIdentifier("");
    setPassword("");
    setEmail("");
    setAgeConfirmed(false);
    setTermsAgreed(false);
    setDeleteConfirmText("");
  }, [activeModal]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage("Please enter both administrative identifier and security key.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setLockoutCountdown(900); // 15 minutes lockout
          throw new Error(data.error || "Too many failed attempts. Administrative portal locked.");
        }
        throw new Error(data.error || "Invalid administrative credentials.");
      }

      // Success
      localStorage.setItem("cv_auth_token", data.token);
      const newSession: UserSession = {
        ign: data.user.ign,
        role: data.user.role,
        coins: 1000,
        battlePassXp: 500,
        battlePassLevel: 5,
        verified: true,
        customTitle: data.user.customTitle,
        authToken: data.token,
        email: data.user.email,
        isLoggedIn: true
      };
      localStorage.setItem("cv_user_session", JSON.stringify(newSession));
      onSessionUpdated(newSession);
      onCloseModal();
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid administrative credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage("Please provide your Player IGN/Email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/member-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid player credentials.");
      }

      localStorage.setItem("cv_auth_token", data.token);
      const newSession: UserSession = {
        ign: data.user.ign,
        role: "Member",
        coins: 250,
        battlePassXp: 100,
        battlePassLevel: 2,
        verified: true,
        customTitle: data.user.customTitle,
        authToken: data.token,
        email: data.user.email,
        isLoggedIn: true
      };
      localStorage.setItem("cv_user_session", JSON.stringify(newSession));
      onSessionUpdated(newSession);
      onCloseModal();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password || !email.trim()) {
      setErrorMessage("Please complete all registration fields.");
      return;
    }
    if (!ageConfirmed) {
      setErrorMessage("You must confirm you are at least 13 years of age to register.");
      return;
    }
    if (!termsAgreed) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ign: identifier.trim(), 
          email: email.trim(), 
          password 
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      localStorage.setItem("cv_auth_token", data.token);
      const newSession: UserSession = {
        ign: data.user.ign,
        role: "Member", // Strictly Member
        coins: 100,
        battlePassXp: 0,
        battlePassLevel: 1,
        verified: true,
        customTitle: "",
        authToken: data.token,
        email: data.user.email,
        isLoggedIn: true
      };
      localStorage.setItem("cv_user_session", JSON.stringify(newSession));
      onSessionUpdated(newSession);
      onCloseModal();
    } catch (err: any) {
      setErrorMessage(err.message || "Registration encountered an error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText.trim().toLowerCase() !== "delete my data") {
      setErrorMessage('Please type "DELETE MY DATA" exactly to confirm.');
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentSession.authToken || localStorage.getItem("cv_auth_token")}`
        },
        body: JSON.stringify({ ign: currentSession.ign })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process data deletion request.");
      }

      // Clear local records
      localStorage.removeItem("cv_auth_token");
      localStorage.removeItem("cv_user_session");
      const visitorSession: UserSession = {
        ign: "Visitor",
        role: "Visitor",
        coins: 0,
        battlePassXp: 0,
        battlePassLevel: 1,
        verified: false,
        isLoggedIn: false
      };
      onSessionUpdated(visitorSession);
      setSuccessMessage("Your account and associated profile records have been permanently erased.");
      setTimeout(() => {
        onCloseModal();
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Deletion request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const acceptAllCookies = () => {
    localStorage.setItem("cv_cookie_consent", "all");
    setShowCookieBanner(false);
  };

  const rejectOptionalCookies = () => {
    localStorage.setItem("cv_cookie_consent", "essential_only");
    setShowCookieBanner(false);
  };

  return (
    <>
      {/* COOKIE & STORAGE CONSENT BANNER (Non-invasive, accessible) */}
      {showCookieBanner && (
        <aside 
          aria-label="Storage and privacy preferences" 
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-lg z-50 bg-stone-950/95 border border-red-950/60 rounded-2xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.95)] backdrop-blur-md animate-fade-in text-left text-xs"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-500 shrink-0">
              <Cookie size={20} />
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="font-orbitron font-black text-white text-xs tracking-wider">
                STORAGE & LOCAL PREFERENCES
              </h4>
              <p className="text-gray-300 font-rajdhani text-xs leading-relaxed">
                Fear 4Fangz uses essential local storage for authentication tokens and your UI preferences. We do not use third-party advertising trackers or sell your data.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={acceptAllCookies}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-orbitron font-bold text-[10px] tracking-wide cursor-pointer transition-all"
                >
                  Accept Preferences
                </button>
                <button
                  onClick={rejectOptionalCookies}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-gray-300 rounded-lg font-mono text-[10px] border border-zinc-800 cursor-pointer transition-all"
                >
                  Essential Only
                </button>
                <button
                  onClick={() => onOpenModal("cookies")}
                  className="px-2.5 py-1.5 text-gray-400 hover:text-white font-mono text-[10px] underline cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* MODAL BACKDROP CONTAINER */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-stone-950 border border-zinc-900 rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
            {/* CLOSE BUTTON */}
            <button
              onClick={onCloseModal}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* 1. SPECIAL ADMIN LOGIN MODAL */}
            {activeModal === "admin-login" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-orbitron text-white tracking-wider flex items-center gap-2">
                      STAFF & COMMAND PORTAL
                      <Crown size={14} className="text-amber-400" />
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Authorized Clan Owners, Administrators, and Tactical Staff Only
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-[11px] text-gray-300 font-mono space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-400">
                    <ShieldCheck size={13} />
                    Cryptographic Password-Scrypt Verification
                  </div>
                  <p className="text-gray-400">
                    Rate-limited entry (5 attempts allowed per 15-minute window). Secret URLs do not grant automated privileges.
                  </p>
                </div>

                {lockoutCountdown !== null && (
                  <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl text-xs text-amber-300 font-mono">
                    ⚠️ Access temporarily locked due to repeated invalid attempts. Retry in:{" "}
                    <strong>{Math.floor(lockoutCountdown / 60)}m {lockoutCountdown % 60}s</strong>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 font-mono">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Staff Username or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      disabled={isLoading || lockoutCountdown !== null}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. CV_Slayer_IGL or ESL_Admin"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Administrative Security Key / Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      disabled={isLoading || lockoutCountdown !== null}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || lockoutCountdown !== null}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-orbitron font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? "Verifying Credentials..." : "Authenticate Staff Session"}
                  </button>
                </form>
              </div>
            )}

            {/* 2. MEMBER LOGIN MODAL */}
            {activeModal === "member-login" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-orbitron text-white tracking-wider">
                      PLAYER SIGN IN
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Access your scrim bookings, battle pass XP, and custom title
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* OFFICIAL GOOGLE SIGN-IN BUTTON */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoading ? "Authenticating with Google..." : "Sign in with Google (Firebase)"}</span>
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-[1px] bg-zinc-800" />
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Or sign in with player credentials</span>
                  <div className="flex-1 h-[1px] bg-zinc-800" />
                </div>

                <form onSubmit={handleMemberLogin} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Player IGN or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      disabled={isLoading}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. CV_Mamba_Flick"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      disabled={isLoading}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-orbitron font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? "Signing In..." : "Enter Esports Arena"}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-gray-500">Need an account? </span>
                    <button
                      type="button"
                      onClick={() => onOpenModal("register")}
                      className="text-[11px] text-red-400 hover:underline font-bold"
                    >
                      Create Free Player Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. MEMBER REGISTRATION MODAL */}
            {activeModal === "register" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-orbitron text-white tracking-wider">
                      JOIN FEAR 4FANGZ COMMUNITY
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Register as a verified competitive member
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* OFFICIAL GOOGLE SIGN-UP BUTTON */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoading ? "Connecting Google..." : "Fast Sign Up with Google (Firebase)"}</span>
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-[1px] bg-zinc-800" />
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Or register with email</span>
                  <div className="flex-1 h-[1px] bg-zinc-800" />
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      In-Game Name (IGN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      disabled={isLoading}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. CV_Sniper_Elite"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      disabled={isLoading}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="player@gmail.com"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Password (min 6 characters) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      disabled={isLoading}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  {/* AGE & CONSENT CHECKBOXES (Strict Requirement) */}
                  <div className="space-y-2 pt-2 border-t border-zinc-900 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer text-gray-300">
                      <input
                        type="checkbox"
                        checked={ageConfirmed}
                        onChange={(e) => setAgeConfirmed(e.target.checked)}
                        className="mt-0.5 accent-red-600 rounded"
                      />
                      <span className="text-[11px] leading-tight">
                        I certify that I am at least <strong>13 years of age</strong> (COPPA/GDPR compliance).
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-gray-300">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-0.5 accent-red-600 rounded"
                      />
                      <span className="text-[11px] leading-tight">
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={() => onOpenModal("terms")}
                          className="text-red-400 underline font-semibold"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => onOpenModal("privacy")}
                          className="text-red-400 underline font-semibold"
                        >
                          Privacy Policy
                        </button>.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-orbitron font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? "Creating Member Account..." : "Create Account (Member)"}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-gray-500">Already registered? </span>
                    <button
                      type="button"
                      onClick={() => onOpenModal("member-login")}
                      className="text-[11px] text-red-400 hover:underline font-bold"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 4. PRIVACY POLICY MODAL */}
            {activeModal === "privacy" && (
              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                  <FileText className="text-red-500" size={20} />
                  <h3 className="font-orbitron font-bold text-white text-base">
                    PRIVACY POLICY
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-rajdhani">
                  <p><strong>Effective Date:</strong> November 2026</p>
                  <p>
                    Fear 4Fangz ("we", "us", or "our") operates the CV Esports Hub platform. This Privacy Policy details how we handle user-generated content, competitive telemetry, authentication credentials, and data rights.
                  </p>
                  
                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">1. Information We Collect</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
                    <li><strong>Account Credentials:</strong> In-Game Name (IGN), email address, and salt-hashed passwords.</li>
                    <li><strong>Competitive Statistics:</strong> Match IDs, kills, weapon contracts, and leaderboard rankings.</li>
                    <li><strong>Communications:</strong> Public and clan chat messages, dispatches, and community reports.</li>
                    <li><strong>Google Workspace (Gmail):</strong> When explicitly connected via Google Sign-In with your permission, we obtain an ephemeral in-memory OAuth access token to allow you to send match invites and view incoming dispatches. We never sell your Gmail contents.</li>
                  </ul>

                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">2. Data Minimization & Retention</h4>
                  <p className="text-gray-400 text-[11px]">
                    We retain data strictly for competitive integrity, active tournament verification, and anti-cheat tracking. Authentication access tokens are held in volatile memory and are cleared upon logout.
                  </p>

                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">3. Third-Party Integrations</h4>
                  <p className="text-gray-400 text-[11px]">
                    Our platform integrates with Google GenAI (AI coaching analysis) and Google Workspace (Gmail). Secrets are maintained securely on the server side.
                  </p>

                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">4. Your Rights & Data Erasure</h4>
                  <p className="text-gray-400 text-[11px]">
                    You have the right to inspect, rectify, or permanently delete your account and personal records at any time through our self-service "Erase My Data" tool.
                  </p>

                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">5. Contact Information</h4>
                  <p className="text-gray-400 text-[11px]">
                    For privacy inquiries or data rights requests, contact our team at: <strong>contact@fear4fangz.com</strong> or <strong>muchecheprince4@gmail.com</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* 5. TERMS OF SERVICE MODAL */}
            {activeModal === "terms" && (
              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                  <Shield className="text-red-500" size={20} />
                  <h3 className="font-orbitron font-bold text-white text-base">
                    TERMS OF SERVICE
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-rajdhani">
                  <p><strong>Last Updated:</strong> November 2026</p>
                  
                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">1. Competitive Integrity & Fair Play</h4>
                  <p className="text-gray-400 text-[11px]">
                    All participants must uphold esports integrity. The use of emulators, memory injections, aim assistance, match-fixing, or exploiting map boundaries results in immediate disqualification and permanent clan blacklisting.
                  </p>

                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">2. Account Responsibility & Titles</h4>
                  <p className="text-gray-400 text-[11px]">
                    Users are responsible for all actions taken on their account. Custom profile titles are cosmetic labels only and cannot mimic administrative roles (such as Owner, Admin, or Moderator).
                  </p>

                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">3. Fees & In-App Economy</h4>
                  <p className="text-gray-400 text-[11px]">
                    CV Esports Hub is a community esports platform. Tournament entry is free of fiat monetary charge unless explicitly stated under authorized commercial rules. In-app Coins and Arena Points (AP) have no cash value.
                  </p>

                  <h4 className="font-orbitron font-bold text-white text-xs pt-2">4. Disclaimers & Service Availability</h4>
                  <p className="text-gray-400 text-[11px]">
                    The service is provided "as is". We reserve the right to suspend or terminate accounts that violate community safety, harass other competitors, or compromise platform integrity.
                  </p>
                </div>
              </div>
            )}

            {/* 6. COOKIE & LOCAL STORAGE POLICY MODAL */}
            {activeModal === "cookies" && (
              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                  <Cookie className="text-red-500" size={20} />
                  <h3 className="font-orbitron font-bold text-white text-base">
                    COOKIE & STORAGE POLICY
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-rajdhani">
                  <p>
                    Fear 4Fangz uses browser local storage technologies instead of invasive tracking cookies.
                  </p>

                  <div className="space-y-2">
                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <strong className="text-white block text-xs">Essential Authentication Storage (Session Token)</strong>
                      <span className="text-gray-400 text-[11px]">
                        Used exclusively to keep your session authenticated when navigating between tournament tabs.
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <strong className="text-white block text-xs">Functional Preferences (Theme & Layout)</strong>
                      <span className="text-gray-400 text-[11px]">
                        Saves your dark/light contrast preference and layout guard toggles.
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <strong className="text-white block text-xs">No Advertising Trackers</strong>
                      <span className="text-gray-400 text-[11px]">
                        We do not sell personal data, nor do we run cross-site advertising networks.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SELF-SERVICE DATA ERASURE MODAL */}
            {activeModal === "delete-account" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                    <Trash2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-orbitron text-white tracking-wider">
                      ERASE PERSONAL DATA & PROFILE
                    </h3>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Right to Erasure (GDPR Article 17 / CCPA)
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-xs text-gray-300 font-mono space-y-2">
                  <p className="font-bold text-red-400">⚠️ Irreversible Account Deletion:</p>
                  <p className="text-[11px] text-gray-400">
                    Deleting your account will erase your registered profile, custom titles, battle pass levels, and account credentials.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-400 font-mono">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-400 font-mono">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleAccountDeletion} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Type <strong>DELETE MY DATA</strong> to confirm:
                    </label>
                    <input
                      type="text"
                      required
                      value={deleteConfirmText}
                      disabled={isLoading}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE MY DATA"
                      className="w-full px-4 py-2.5 bg-neutral-900 border border-red-900/40 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onCloseModal}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-gray-400 rounded-xl text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-orbitron font-bold cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {isLoading ? "Erasing Records..." : "Permanently Erase"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LegalAndAuthModals;
