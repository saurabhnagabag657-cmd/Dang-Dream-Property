import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset Password — Dang Dream Property" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await resetPassword(email);

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  return (
    <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
      <div className="container-luxe flex justify-center">
        <div className="w-full max-w-md">

          {/* Back link */}
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>

          {/* ── Success State ── */}
          {sent ? (
            <div className="bg-card rounded-3xl p-8 shadow-card border border-border text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary">Check Your Email</h1>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
                Click the link in the email to set a new password.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => { setSent(false); setError(null); }}
                  className="text-primary font-semibold hover:underline"
                >
                  try again
                </button>.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary">Forgot Password?</h1>
                <p className="mt-2 text-muted-foreground">Enter your email and we'll send you a reset link</p>
              </div>

              {/* Card */}
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border">

                {/* Error Banner */}
                {error && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-semibold mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="reset-email"
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-luxe"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    {loading ? "Sending…" : "Send Reset Link"}
                  </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
