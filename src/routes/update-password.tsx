import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { updatePassword } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/update-password")({
  head: () => ({
    meta: [{ title: "Set New Password - Dang Dream Property" }],
  }),
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();

  const [gracePeriod, setGracePeriod] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Give the auth listener a moment to hydrate session after /auth/callback redirects here.
  useEffect(() => {
    const t = window.setTimeout(() => setGracePeriod(false), 1500);
    return () => window.clearTimeout(t);
  }, []);

  // Redirect to login if there's no active recovery session
  useEffect(() => {
    if (!authLoading && !session && !gracePeriod) {
      navigate({ to: "/login" });
    }
  }, [authLoading, session, gracePeriod, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: authError } = await updatePassword(password);

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-pearl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
        <div className="container-luxe flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-3xl p-8 shadow-card border border-border text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary">Password Updated!</h1>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
      <div className="container-luxe flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary">Set New Password</h1>
            <p className="mt-2 text-muted-foreground">Choose a strong password for your account</p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-semibold mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-12 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-new-password" className="block text-sm font-semibold mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="confirm-new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-luxe"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

