import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { resendVerificationEmail, signIn, signInWithGoogle, signInWithMagicLink } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign In - Dang Dream Property" }],
  }),
  component: LoginPage,
});

function looksLikeEmailNotConfirmed(err: any) {
  const msg = String(err?.message || "").toLowerCase();
  const code = String(err?.code || err?.error_code || "").toLowerCase();
  return (
    msg.includes("email not confirmed") ||
    msg.includes("email") && msg.includes("confirm") ||
    code === "email_not_confirmed"
  );
}

function looksLikeInvalidCredentials(err: any) {
  const msg = String(err?.message || "").toLowerCase();
  const code = String(err?.code || err?.error_code || "").toLowerCase();
  return msg.includes("invalid login credentials") || code === "invalid_credentials";
}

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  if (!authLoading && isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setShowResend(false);
    setLoading(true);

    const emailValue = email.trim();
    const { data, error: authError } = await signIn(emailValue, password);

    // Supabase can return user but no session for certain states; treat as not verified.
    const unverifiedUser =
      !authError && data?.user && !data?.session && data.user.email_confirmed_at == null;

    if (authError || unverifiedUser) {
      if (unverifiedUser || looksLikeEmailNotConfirmed(authError)) {
        setError("Your email is not verified yet. Please verify your email to sign in.");
        setShowResend(true);
      } else if (looksLikeInvalidCredentials(authError)) {
        // Security: do not reveal whether the email exists. Keep this generic.
        setError("Invalid email or password. If you signed up using an email link, use \"Send sign-in link to email\" or reset your password to set a new one.");
      } else {
        setError(authError?.message || "Sign in failed. Please try again.");
      }
      setLoading(false);
      return;
    }

    navigate({ to: "/" });
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setInfo(null);
    setShowResend(false);
    const { error: authError } = await signInWithGoogle();
    if (authError) {
      setError(authError.message);
    }
  };

  const handleMagicLink = async () => {
    const emailValue = email.trim();
    if (!emailValue) {
      setError("Please enter your email first.");
      return;
    }
    setMagicLoading(true);
    setError(null);
    setInfo(null);
    setShowResend(false);
    const { error: authError } = await signInWithMagicLink(emailValue);
    if (authError) {
      setError(authError.message);
    } else {
      setInfo("We sent you a sign-in link. Please check your email (and spam folder).");
    }
    setMagicLoading(false);
  };

  const handleResend = async () => {
    const emailValue = email.trim();
    if (!emailValue) return;
    setResendLoading(true);
    setError(null);
    setInfo(null);
    const { error: resendError } = await resendVerificationEmail(emailValue);
    if (resendError) {
      setError(resendError.message);
    } else {
      setInfo("Verification email sent. Please check your inbox (and spam folder).");
      setShowResend(false);
    }
    setResendLoading(false);
  };

  return (
    <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
      <div className="container-luxe flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your Dang Dream Property account</p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {info && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                {info}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-border bg-white hover:bg-gray-50 text-sm font-semibold text-foreground transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={magicLoading}
              className="mt-3 w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-border bg-white hover:bg-gray-50 text-sm font-semibold text-foreground transition-colors disabled:opacity-60"
            >
              {magicLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {magicLoading ? "Sending..." : "Send sign-in link to email"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground uppercase tracking-wider">or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-sm font-semibold">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-12 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-luxe"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {showResend && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full h-12 rounded-xl border border-border bg-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-60 transition-colors"
                >
                  {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {resendLoading ? "Sending..." : "Resend Verification Email"}
                </button>
              )}
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
