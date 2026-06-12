import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CirclePlus,
  Eye,
  FileImage,
  Save,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { AMENITY_OPTIONS, PROPERTY_TYPES, buildDefaultPropertySlug } from "@/lib/listings";
// Client-only listing APIs are dynamically imported to avoid server import protection
import type { Property } from "@/lib/data";

type Search = { edit?: string };
type SelectedImage = { id: string; file: File; preview: string };

const emptyForm = (contactName = "", contactPhone = "", contactEmail = "") => ({
  title: "",
  description: "",
  price: "",
  propertyType: "House",
  txn: "sale" as Property["txn"],
  fullLocation: "",
  location: "",
  city: "",
  road: "",
  facing: "",
  googleMapsUrl: "",
  bedrooms: 0,
  bathrooms: 0,
  livingRooms: 0,
  kitchens: 0,
  landArea: "",
  builtUpArea: "",
  contactName,
  contactPhone,
  contactEmail,
  amenities: [] as string[],
  featured: false,
  approvalStatus: "draft" as "draft" | "pending" | "approved" | "rejected",
  listingState: "draft" as "draft" | "pending" | "approved" | "rejected" | "available" | "sold" | "rented",
});

export const Route = createFileRoute("/list-property")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
  head: () => ({ meta: [{ title: "List Property — Dang Dream Property" }] }),
  component: ListPropertyPage,
});

function ListPropertyPage() {
  const { user, profile } = useAuth();
  const search = Route.useSearch();
  const editId = search.edit ?? "";

  const [loadingExisting, setLoadingExisting] = useState(!!editId);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<{ urls: string[]; paths: string[] }>({ urls: [], paths: [] });
  const [removedImagePaths, setRemovedImagePaths] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitMode, setSubmitMode] = useState<"draft" | "pending">("pending");

  const [form, setForm] = useState(
    emptyForm(profile?.full_name ?? profile?.username ?? user?.email ?? "", "", user?.email ?? ""),
  );

  useEffect(() => {
    let alive = true;
    if (!editId) {
      setLoadingExisting(false);
      return;
    }

    (async () => {
      try {
        const m = await import(`@/lib/${"property-listings.client"}`);
        const listing = await m.fetchListingById(editId);
        if (!alive) return;
        if (!listing) {
          setError("We could not find that listing.");
          setLoadingExisting(false);
          return;
        }

        if (listing.ownerId && user && listing.ownerId !== user.id && profile?.status !== "admin") {
          setError("You do not have permission to edit this listing.");
          setLoadingExisting(false);
          return;
        }

        setExistingId(editId);
        setExistingImages({
          urls: listing.imageUrls ?? (listing.image ? [listing.image] : []),
          paths: listing.imagePaths ?? [],
        });
        setForm({
          title: listing.name,
          description: listing.description,
          price: listing.price,
          propertyType: listing.type,
          txn: listing.txn,
          fullLocation: listing.location,
          location: listing.location.split(",")[0]?.trim() ?? "",
          city: listing.city ?? "",
          road: listing.road ?? "",
          facing: listing.facing ?? "",
          googleMapsUrl: listing.googleMapsUrl ?? "",
          bedrooms: listing.beds ?? 0,
          bathrooms: listing.baths ?? 0,
          livingRooms: listing.livingRoomsCount ?? 0,
          kitchens: listing.kitchensCount ?? 0,
          landArea: listing.landArea ?? listing.area ?? "",
          builtUpArea: listing.builtUpArea ?? "",
          contactName: listing.contactName ?? profile?.full_name ?? profile?.username ?? user?.email ?? "",
          contactPhone: listing.contactPhone ?? "",
          contactEmail: listing.contactEmail ?? user?.email ?? "",
          amenities: listing.amenities ?? [],
          featured: !!listing.featured,
          approvalStatus: listing.approvalStatus ?? "draft",
          listingState: listing.listingState ?? "draft",
        });
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load listing.");
      } finally {
        if (alive) setLoadingExisting(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [editId, user, profile?.status, profile?.full_name, profile?.username]);

  const allPreviewImages = useMemo(() => {
    const existing = existingImages.urls
      .map((url, index) => ({ id: `existing-${index}`, src: url, kind: "existing" as const, path: existingImages.paths[index] }))
      .filter((img) => img.src && !removedImagePaths.includes(img.path ?? ""));
    const selected = selectedImages.map((img) => ({ id: img.id, src: img.preview, kind: "new" as const, path: img.file.name }));
    return [...existing, ...selected];
  }, [existingImages, removedImagePaths, selectedImages]);

  useEffect(() => {
    return () => {
      selectedImages.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [selectedImages]);

  const onField = (key: keyof typeof form, value: string | number | boolean | string[]) =>
    setForm((current) => ({ ...current, [key]: value } as typeof current));

  const onPickFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({
      id: `${file.name}-${crypto.randomUUID()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages((current) => [...current, ...next]);
  };

  const removeExistingImage = (path: string) => {
    setRemovedImagePaths((current) => [...current, path]);
  };

  const removeNewImage = (id: string) => {
    setSelectedImages((current) => {
      const next = current.filter((img) => img.id !== id);
      const removed = current.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const toggleAmenity = (amenity: string) => {
    setForm((current) => {
      const exists = current.amenities.includes(amenity);
      return {
        ...current,
        amenities: exists ? current.amenities.filter((item) => item !== amenity) : [...current.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (mode: "draft" | "pending") => {
    setError(null);
    setSuccess(null);
    setSubmitMode(mode);

    if (!form.title.trim()) return setError("Please add a property title.");
    if (!form.description.trim()) return setError("Please add a property description.");
    if (!form.price.trim()) return setError("Please add a property price.");
    if (!form.fullLocation.trim()) return setError("Please add the full location or address.");

    const totalImages = (existingImages.urls.length - removedImagePaths.length) + selectedImages.length;
    if (mode === "pending" && totalImages < 5) {
      return setError("Please add at least 5 property images before submitting for approval.");
    }

    if (!user) return setError("Please sign in again and try.");

    setSaving(true);
    try {
      const cleanedFullLocation = form.fullLocation.trim();
      const slug = buildDefaultPropertySlug(form.title, cleanedFullLocation);
      const m = await import(`@/lib/${"property-listings.client"}`);
      const saved = await m.savePropertyListing({
        ownerId: user.id,
        existingId: existingId || undefined,
        slug: existingId ? slug : undefined,
        form: {
          ...form,
          approvalStatus: mode,
          listingState: mode === "draft" ? "draft" : "pending",
        },
        existingImages,
        removedImagePaths,
        newFiles: selectedImages.map((img) => img.file),
      });

      if (!saved) {
        throw new Error("Unable to save listing.");
      }

      setSuccess(mode === "draft" ? "Draft saved successfully." : "Listing submitted for admin approval.");
      setExistingId(saved.id.slice(2));
      setExistingImages({ urls: saved.imageUrls ?? [], paths: saved.imagePaths ?? [] });
      setRemovedImagePaths([]);
      setSelectedImages([]);
      if (mode === "pending") {
        setForm((current) => ({ ...current, approvalStatus: "pending", listingState: "pending" }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingExisting) {
    return (
      <RequireAuth>
        <div className="pt-[100px] min-h-screen flex items-center justify-center bg-pearl">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
        <div className="container-luxe max-w-6xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center">
                <CirclePlus className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-primary">
                  {existingId ? "Edit Listing" : "List Your Property"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create drafts, upload images, and submit your property for admin approval.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-primary/90"
              >
                <Eye className="w-4 h-4" /> View Listings
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">{success}</div>
                <p className="text-green-700/90 mt-1">You can keep editing drafts from your dashboard any time.</p>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-8 min-w-0">
              <section className="bg-card rounded-3xl border border-border shadow-card p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                  <Sparkles className="w-4 h-4" />
                  Listing Basics
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Property Title" required>
                    <input value={form.title} onChange={(e) => onField("title", e.target.value)} className="input" />
                  </Field>
                  <Field label="Property Type" required>
                    <select value={form.propertyType} onChange={(e) => onField("propertyType", e.target.value)} className="input">
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Property Status" required>
                    <select
                      value={form.txn}
                      onChange={(e) => onField("txn", e.target.value as Property["txn"])}
                      className="input"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                      <option value="exchange">Exchange</option>
                    </select>
                  </Field>
                  <Field label="Property Price" required>
                    <input value={form.price} onChange={(e) => onField("price", e.target.value)} className="input" placeholder="Rs. 1.2 Crore" />
                  </Field>
                  <Field label="Full Location / Address" required>
                    <input value={form.fullLocation} onChange={(e) => onField("fullLocation", e.target.value)} className="input" placeholder="Ghorahi-15, Dang, Nepal" />
                  </Field>
                  <Field label="Google Maps URL (optional)">
                    <input value={form.googleMapsUrl} onChange={(e) => onField("googleMapsUrl", e.target.value)} className="input" placeholder="Paste Google Maps link" />
                  </Field>
                  <Field label="City / Area">
                    <input value={form.city} onChange={(e) => onField("city", e.target.value)} className="input" placeholder="Ghorahi" />
                  </Field>
                  <Field label="Road / Frontage">
                    <input value={form.road} onChange={(e) => onField("road", e.target.value)} className="input" placeholder="16ft Road" />
                  </Field>
                  <Field label="Facing">
                    <input value={form.facing} onChange={(e) => onField("facing", e.target.value)} className="input" placeholder="East Facing" />
                  </Field>
                  <Field label="Land Area">
                    <input value={form.landArea} onChange={(e) => onField("landArea", e.target.value)} className="input" placeholder="1 Kattha / 5 Ropani" />
                  </Field>
                  <Field label="Built-up Area">
                    <input value={form.builtUpArea} onChange={(e) => onField("builtUpArea", e.target.value)} className="input" placeholder="1800 sq ft" />
                  </Field>
                  <Field label="Bedrooms">
                    <input type="number" min={0} value={form.bedrooms} onChange={(e) => onField("bedrooms", Number(e.target.value) || 0)} className="input" />
                  </Field>
                  <Field label="Bathrooms">
                    <input type="number" min={0} value={form.bathrooms} onChange={(e) => onField("bathrooms", Number(e.target.value) || 0)} className="input" />
                  </Field>
                  <Field label="Living Rooms">
                    <input type="number" min={0} value={form.livingRooms} onChange={(e) => onField("livingRooms", Number(e.target.value) || 0)} className="input" />
                  </Field>
                  <Field label="Kitchens">
                    <input type="number" min={0} value={form.kitchens} onChange={(e) => onField("kitchens", Number(e.target.value) || 0)} className="input" />
                  </Field>
                </div>
                <Field label="Property Description" required>
                  <textarea
                    rows={7}
                    value={form.description}
                    onChange={(e) => onField("description", e.target.value)}
                    className="input resize-none"
                    placeholder="Describe the property, setting, highlights, and any standout features."
                  />
                </Field>
              </section>

              <section className="bg-card rounded-3xl border border-border shadow-card p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                  <FileImage className="w-4 h-4" />
                  Images
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload at least 5 images before submitting for approval. You can keep drafts incomplete.
                </p>

                <div className="mt-4 border-2 border-dashed border-border rounded-2xl bg-pearl p-5">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPickFiles(e.target.files)}
                    className="block w-full text-sm"
                  />
                  <div className="mt-3 text-xs text-muted-foreground">
                    Supported: JPG, PNG, WEBP, AVIF. Image previews appear below.
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allPreviewImages.map((image) => (
                    <div key={image.id} className="relative rounded-2xl overflow-hidden border border-border bg-pearl">
                      <div className="aspect-[4/3]">
                        <img src={image.src} alt="" className="h-full w-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => (image.kind === "existing" ? removeExistingImage(image.path ?? "") : removeNewImage(image.id))}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-card rounded-3xl border border-border shadow-card p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                  Amenities
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const checked = form.amenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                          checked ? "border-primary bg-primary/5" : "border-border bg-white"
                        }`}
                      >
                        <input type="checkbox" checked={checked} onChange={() => toggleAmenity(amenity)} />
                        <span className="font-medium">{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="bg-card rounded-3xl border border-border shadow-card p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                  Contact Details
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Contact Name" required>
                    <input value={form.contactName} onChange={(e) => onField("contactName", e.target.value)} className="input" />
                  </Field>
                  <Field label="Contact Phone" required>
                    <input value={form.contactPhone} onChange={(e) => onField("contactPhone", e.target.value)} className="input" />
                  </Field>
                  <Field label="Contact Email">
                    <input value={form.contactEmail} onChange={(e) => onField("contactEmail", e.target.value)} className="input" />
                  </Field>
                </div>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 self-start">
              <div className="bg-card rounded-3xl border border-border shadow-card p-5 sm:p-6">
                <div className="font-display text-2xl font-bold text-primary">{form.title || "Preview Listing"}</div>
                <div className="mt-2 text-sm text-muted-foreground">{form.fullLocation || "Your location preview will appear here."}</div>
                <div className="mt-5 rounded-2xl overflow-hidden bg-pearl border border-border aspect-[4/3]">
                  <img src={allPreviewImages[0]?.src || fallbackPreview} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Images</span><span className="font-semibold">{allPreviewImages.length}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Amenities</span><span className="font-semibold">{form.amenities.length}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Approval</span><span className="font-semibold">{form.approvalStatus}</span></div>
                </div>
              </div>

              <div className="bg-card rounded-3xl border border-border shadow-card p-5 sm:p-6 space-y-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSubmit("draft")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {saving && submitMode === "draft" ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSubmit("pending")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  <Upload className="w-4 h-4" /> {saving && submitMode === "pending" ? "Submitting..." : "Submit for Approval"}
                </button>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drafts stay private. Submitted listings go to the admin approval queue before they appear publicly.
                </p>
              </div>
            </aside>
          </div>
          <style>{`
            .input {
              width: 100%;
              border-radius: 0.85rem;
              border: 1px solid var(--border);
              background: white;
              padding: 0.78rem 0.95rem;
              font-size: 0.94rem;
              outline: none;
            }
            .input:focus {
              border-color: var(--primary);
              box-shadow: 0 0 0 3px rgba(10, 31, 92, 0.12);
            }
          `}</style>
        </div>
      </div>
    </RequireAuth>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
    </label>
  );
}

const fallbackPreview = fallbackPropertyImg;
