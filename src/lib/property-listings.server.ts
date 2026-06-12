import { createClient } from "@supabase/supabase-js";
import {
  buildDefaultPropertySlug,
  normalizeListValue,
  parsePriceValue,
  recordToProperty,
  type ListingApprovalStatus,
  type ListingState,
  type PropertyRecord,
} from "@/lib/listings";
import type { Property } from "@/lib/data";

function normalizeSupabaseUrl(raw: string | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (/^[a-z0-9-]+\.supabase\.co$/i.test(value)) return `https://${value}`;
  return value;
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined);
const serviceRoleKey = (import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined) ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  console.warn("⚠️ Supabase server credentials missing. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}

export const supabaseServer = createClient(supabaseUrl || "https://placeholder.supabase.co", serviceRoleKey || "placeholder-key");

export function mapPropertyRecord(row: PropertyRecord): Property {
  return recordToProperty(row);
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabaseServer.from("user_properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapPropertyRecord(data as PropertyRecord) : null;
}
