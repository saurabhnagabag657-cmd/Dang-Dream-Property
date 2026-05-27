import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Auth Callback - Dang Dream Property" }] }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign-in...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function run() {
      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.startsWith("#") ? url.hash.slice(1) : url.hash);

        const code = url.searchParams.get("code") || hashParams.get("code");
        const type = url.searchParams.get("type") || hashParams.get("type");
        const errorCode = url.searchParams.get("error_code") || hashParams.get("error_code");
        const errorDescription = url.searchParams.get("error_description") || hashParams.get("error_description");

        if (errorCode) {
          if (cancelled) return;
          setStatus("error");
          setMessage(decodeURIComponent(errorDescription || "This link is invalid or has expired."));
          return;
        }

        // Some Supabase redirects include tokens in the URL hash (implicit grant style).
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        }

        // PKCE code flow (email verification, OAuth, password recovery).
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;

        if (cancelled) return;

        if (type === "recovery") {
          setStatus("success");
          setMessage("Reset link verified. Redirecting to set your new password...");
          timer = window.setTimeout(() => navigate({ to: "/update-password" }), 2000);
          return;
        }

        if (hasSession) {
          setStatus("success");
          setMessage("Success! Redirecting...");
          timer = window.setTimeout(() => navigate({ to: "/login" }), 2000);
          return;
        }

        setStatus("error");
        setMessage("This link is invalid or expired. Please request a new one.");
      } catch (err: any) {
        if (cancelled) return;
        setStatus("error");
        setMessage(err?.message || "Sign-in failed. Please try again.");
      }
    }

    void run();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
      <div className="container-luxe flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border text-center">
            {status === "loading" ? (
              <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
            ) : status === "success" ? (
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-9 h-9 text-green-600 animate-pulse" />
              </div>
            ) : (
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-2">
                <AlertCircle className="w-9 h-9 text-red-600" />
              </div>
            )}

            <p className="mt-6 text-sm text-muted-foreground">{message}</p>

            {status !== "loading" && (
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center hover:bg-primary/90 transition-colors shadow-luxe"
                >
                  Go to Sign In
                </Link>
                <Link
                  to="/forgot-password"
                  className="w-full h-12 rounded-xl border border-border bg-white text-sm font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  Request Password Reset
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

