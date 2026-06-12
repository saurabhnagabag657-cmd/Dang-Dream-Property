import { supabase } from "@/integrations/supabase/client";
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

export const PROPERTY_IMAGES_BUCKET = "property-images";

export type PropertyFormInput = {
  title: string;
  description: string;
  price: string;
  propertyType: string;
  txn: Property["txn"];
  fullLocation: string;
  location?: string;
  city?: string;
  road?: string;
  facing?: string;
  googleMapsUrl?: string;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  kitchens: number;
  landArea?: string;
  builtUpArea?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  amenities: string[];
  approvalStatus: ListingApprovalStatus;
  listingState: ListingState;
  featured: boolean;
};

export function mapPropertyRecord(row: PropertyRecord): Property {
  return recordToProperty(row);
}

async function getFilePublicUrl(path: string) {
  const { data } = supabase.storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPropertyImages(args: {
  ownerId: string;
  slug: string;
  files: File[];
}) {
  if (!args.files.length) {
    return { urls: [] as string[], paths: [] as string[] };
  }

  const uploads = await Promise.all(
    args.files.map(async (file, index) => {
      const safeName = `${Date.now()}-${index}-${file.name}`.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${args.ownerId}/${args.slug}/${safeName}`;
      const { error } = await supabase.storage.from(PROPERTY_IMAGES_BUCKET).upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

      if (error) throw error;

      return {
        path,
        url: await getFilePublicUrl(path),
      };
    }),
  );

  return {
    urls: uploads.map((item) => item.url),
    paths: uploads.map((item) => item.path),
  };
}

export async function removePropertyImages(paths: string[]) {
  if (!paths.length) return;
  const { error } = await supabase.storage.from(PROPERTY_IMAGES_BUCKET).remove(paths);
  if (error) throw error;
}

export async function fetchMyListings(ownerId: string) {
  const { data, error } = await supabase
    .from("user_properties")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapPropertyRecord(row as PropertyRecord));
}

export async function fetchAllApprovedListings() {
  const { data, error } = await supabase
    .from("user_properties")
    .select("*")
    .eq("approval_status", "approved")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapPropertyRecord(row as PropertyRecord));
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabase.from("user_properties").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapPropertyRecord(data as PropertyRecord) : null;
}

export async function fetchAdminListings() {
  const { data, error } = await supabase
    .from("user_properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapPropertyRecord(row as PropertyRecord));
}

export async function savePropertyListing(args: {
  ownerId: string;
  existingId?: string;
  slug?: string;
  form: PropertyFormInput;
  existingImages: { urls: string[]; paths: string[] };
  removedImagePaths: string[];
  newFiles: File[];
}) {
  const slug = (args.slug?.trim() || buildDefaultPropertySlug(args.form.title, args.form.fullLocation)).toLowerCase();
  const uploaded = await uploadPropertyImages({
    ownerId: args.ownerId,
    slug,
    files: args.newFiles,
  });

  if (args.removedImagePaths.length) {
    await removePropertyImages(args.removedImagePaths);
  }

  const currentExisting = args.existingImages.urls
    .map((url, index) => ({ url, path: args.existingImages.paths[index] }))
    .filter((item) => item.path && !args.removedImagePaths.includes(item.path));
  const imageUrls = [...currentExisting.map((item) => item.url), ...uploaded.urls];
  const imagePaths = [...currentExisting.map((item) => item.path as string), ...uploaded.paths];

  const payload = {
    owner_id: args.ownerId,
    slug,
    title: args.form.title,
    description: args.form.description,
    price: args.form.price,
    price_value: parsePriceValue(args.form.price),
    property_type: args.form.propertyType,
    txn: args.form.txn,
    listing_state: args.form.listingState,
    approval_status: args.form.approvalStatus,
    full_location: args.form.fullLocation,
    location: args.form.location || null,
    city: args.form.city || null,
    road: args.form.road || null,
    facing: args.form.facing || null,
    google_maps_url: args.form.googleMapsUrl || null,
    bedrooms: args.form.bedrooms,
    bathrooms: args.form.bathrooms,
    living_rooms: args.form.livingRooms,
    kitchens: args.form.kitchens,
    land_area: args.form.landArea || null,
    built_up_area: args.form.builtUpArea || null,
    contact_name: args.form.contactName,
    contact_phone: args.form.contactPhone,
    contact_email: args.form.contactEmail || null,
    amenities: args.form.amenities,
    image_urls: imageUrls,
    image_paths: imagePaths,
    cover_image_url: imageUrls[0] || null,
    cover_image_path: imagePaths[0] || null,
    featured: args.form.featured,
  };

  if (args.existingId) {
    const { data, error } = await supabase
      .from("user_properties")
      .update(payload)
      .eq("id", args.existingId)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? mapPropertyRecord(data as PropertyRecord) : null;
  }

  const { data, error } = await supabase
    .from("user_properties")
    .insert(payload)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? mapPropertyRecord(data as PropertyRecord) : null;
}

export async function updatePropertyState(id: string, listingState: ListingState) {
  const payload: Record<string, unknown> = { listing_state: listingState };
  if (listingState === "draft") {
    payload.approval_status = "draft";
  }

  const { data, error } = await supabase.from("user_properties").update(payload).eq("id", id).select("*").maybeSingle();
  if (error) throw error;
  return data ? mapPropertyRecord(data as PropertyRecord) : null;
}

export async function updateApprovalStatus(args: {
  id: string;
  approvalStatus: ListingApprovalStatus;
  listingState?: ListingState;
  rejectedReason?: string | null;
  featured?: boolean;
}) {
  const payload: Record<string, unknown> = { approval_status: args.approvalStatus };
  if (args.listingState) payload.listing_state = args.listingState;
  if (args.rejectedReason !== undefined) payload.rejected_reason = args.rejectedReason;
  if (args.featured !== undefined) payload.featured = args.featured;

  const { data, error } = await supabase
    .from("user_properties")
    .update(payload)
    .eq("id", args.id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? mapPropertyRecord(data as PropertyRecord) : null;
}

export async function deletePropertyListing(id: string) {
  const { data: listing } = await supabase.from("user_properties").select("*").eq("id", id).maybeSingle();
  if (listing) {
    const paths = normalizeListValue((listing as PropertyRecord).image_paths);
    await removePropertyImages(paths);
  }

  const { error } = await supabase.from("user_properties").delete().eq("id", id);
  if (error) throw error;
}

export async function logPropertyView(propertyId: string) {
  const { error } = await supabase.rpc("log_property_view", {
    p_property_id: propertyId,
    p_viewer_id: null,
  });
  if (error) throw error;
}

export async function submitPropertyInquiry(args: {
  propertyId: string;
  propertyTitle: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  message?: string;
}) {
  const { data, error } = await supabase.rpc("submit_property_inquiry", {
    p_property_id: args.propertyId,
    p_property_title: args.propertyTitle,
    p_sender_name: args.name,
    p_sender_phone: args.phone,
    p_sender_email: args.email || null,
    p_role: args.role || "Buyer",
    p_message: args.message || "",
  });
  if (error) throw error;
  return data as string | null;
}
