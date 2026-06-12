import fallbackPropertyImg from "@/assets/1 (2).webp";
import type { Property } from "@/lib/data";

export const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Villa",
  "Land",
  "Commercial",
  "Office Space",
  "Shop Space",
  "Farm Land",
];

export const AMENITY_OPTIONS = [
  "Parking",
  "Garden",
  "Balcony",
  "Security",
  "Water Supply",
  "Internet",
  "Lift",
  "Power Backup",
  "Modular Kitchen",
  "Built-in Wardrobe",
  "Road Access",
  "Gated Community",
];

export type ListingApprovalStatus = "draft" | "pending" | "approved" | "rejected";
export type ListingState = "draft" | "pending" | "approved" | "rejected" | "available" | "sold" | "rented";
export type TransactionType = Property["txn"];

export type PropertyRecord = {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  price_value: number | string | null;
  property_type: string;
  txn: TransactionType;
  listing_state?: ListingState | null;
  approval_status?: ListingApprovalStatus | null;
  full_location: string;
  location?: string | null;
  city?: string | null;
  road?: string | null;
  facing?: string | null;
  google_maps_url?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  living_rooms?: number | null;
  kitchens?: number | null;
  land_area?: string | null;
  built_up_area?: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email?: string | null;
  amenities?: string[] | string | null;
  image_urls?: string[] | string | null;
  image_paths?: string[] | string | null;
  cover_image_url?: string | null;
  cover_image_path?: string | null;
  featured?: boolean | null;
  views_count?: number | null;
  inquiries_count?: number | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  rejected_reason?: string | null;
  admin_notes?: string | null;
};

export function normalizeListValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => String(entry)).filter(Boolean);
      }
    } catch {
      return value.split(",").map((entry) => entry.trim()).filter(Boolean);
    }
  }
  return [];
}

export function slugifyPropertyTitle(title: string, idSuffix = "") {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "property"}${idSuffix ? `-${idSuffix}` : ""}`;
}

export function parsePriceValue(price: string) {
  const digits = price.replace(/[^0-9.]/g, "");
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function recordToProperty(row: PropertyRecord): Property {
  const images = normalizeListValue(row.image_urls);
  const image = row.cover_image_url || images[0] || fallbackPropertyImg;
  const location = row.location || row.full_location;

  return {
    id: `u-${row.id}`,
    name: row.title,
    type: row.property_type,
    txn: row.txn,
    price: row.price,
    priceValue: Number(row.price_value) || parsePriceValue(row.price),
    location,
    city: row.city || undefined,
    area: row.land_area || row.built_up_area || "",
    beds: row.bedrooms ?? undefined,
    baths: row.bathrooms ?? undefined,
    road: row.road || "",
    facing: row.facing || undefined,
    image,
    description: row.description || "",
    approvalStatus: (row.approval_status as Property["approvalStatus"]) ?? "draft",
    listingState: (row.listing_state as Property["listingState"]) ?? "draft",
    featured: !!row.featured,
    ownerId: row.owner_id,
    googleMapsUrl: row.google_maps_url || undefined,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    contactEmail: row.contact_email ?? null,
    bedroomsCount: row.bedrooms ?? undefined,
    bathroomsCount: row.bathrooms ?? undefined,
    livingRoomsCount: row.living_rooms ?? undefined,
    kitchensCount: row.kitchens ?? undefined,
    landArea: row.land_area || undefined,
    builtUpArea: row.built_up_area || undefined,
    amenities: normalizeListValue(row.amenities),
    imageUrls: images,
    imagePaths: normalizeListValue(row.image_paths),
    viewsCount: row.views_count ?? 0,
    inquiriesCount: row.inquiries_count ?? 0,
  };
}

export function buildDefaultPropertySlug(title: string, location?: string) {
  const base = slugifyPropertyTitle(`${title} ${location ?? ""}`);
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export function isPublishedListing(property: Property) {
  return property.approvalStatus === "approved" && property.listingState !== "draft";
}

export function listingBadgeLabel(status?: Property["listingState"]) {
  switch (status) {
    case "sold":
      return "SOLD";
    case "rented":
      return "RENTED";
    case "available":
      return "AVAILABLE";
    case "pending":
      return "PENDING";
    case "approved":
      return "APPROVED";
    case "rejected":
      return "REJECTED";
    default:
      return "DRAFT";
  }
}

