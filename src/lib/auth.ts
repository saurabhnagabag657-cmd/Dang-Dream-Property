import { supabase } from "@/integrations/supabase/client";
import type { AuthError, AuthResponse as SupaAuthResponse, OAuthResponse } from "@supabase/supabase-js";
import {
  requestMagicLinkEmail,
  requestPasswordResetEmail,
  requestSignupEmail,
  requestVerificationResendEmail,
} from "./email";

function normalizeSiteUrl(raw: string | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value.replace(/\/+$/, "");
  return value;
}

function getSiteUrl() {
  const fromEnv = normalizeSiteUrl(import.meta.env.VITE_SITE_URL);
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

function redirectUrl(pathname: string) {
  const base = getSiteUrl();
  if (!base) return undefined;
  return new URL(pathname, base).toString();
}

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export type AuthResult<T = unknown> = {
  data: T | null;
  error: AuthError | null;
};

// ──────────────────────────────────────────────
// Sign Up — Email / Password
// ──────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  username?: string
): Promise<AuthResult> {
  const { error } = await requestSignupEmail(email.trim(), password, username);
  return { data: null, error: error as AuthError | null };
}

// ──────────────────────────────────────────────
// Sign In — Email / Password
// ──────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  return { data, error };
}

// ──────────────────────────────────────────────
// Sign In - Magic Link (Email OTP)
// ──────────────────────────────────────────────
export async function signInWithMagicLink(email: string): Promise<AuthResult> {
  const { error } = await requestMagicLinkEmail(email.trim());
  return { data: null, error: error as AuthError | null };
}

// ──────────────────────────────────────────────
// Sign In — Google OAuth
// ──────────────────────────────────────────────
export async function signInWithGoogle(): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl("/auth/callback"),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  return { data, error };
}

// ──────────────────────────────────────────────
// Sign Out
// ──────────────────────────────────────────────
export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  return { data: null, error };
}

// ──────────────────────────────────────────────
// Forgot Password — sends reset email
// ──────────────────────────────────────────────
export async function resetPassword(email: string): Promise<AuthResult> {
  const { error } = await requestPasswordResetEmail(email.trim());
  return { data: null, error: error as AuthError | null };
}

// ──────────────────────────────────────────────
// Update Password — used after reset link click
// ──────────────────────────────────────────────
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
}

// ──────────────────────────────────────────────
// Resend Email Verification
// ──────────────────────────────────────────────
export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  const { error } = await requestVerificationResendEmail(email.trim());
  return { data: null, error: error as AuthError | null };
}

// ──────────────────────────────────────────────
// Get Profile from public.profiles
// ──────────────────────────────────────────────
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return { data, error };
}

// ──────────────────────────────────────────────
// Update Profile
// ──────────────────────────────────────────────
export async function updateProfile(
  userId: string,
  updates: { username?: string; full_name?: string; avatar_url?: string; website?: string }
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .maybeSingle();
  return { data, error };
}
