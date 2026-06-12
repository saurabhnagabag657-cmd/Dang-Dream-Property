import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Ruler,
  Phone,
  MessageCircle,
  Calendar,
  ArrowLeftRight,
  CheckCircle2,
} from "lucide-react";
import { properties, PHONE, type Property } from "@/lib/data";
import { fetchListingById } from "@/lib/property-listings.server";
import { EMICalculator } from "@/components/site/EMICalculator";
import fallbackPropertyImg from "@/assets/1 (2).webp";
import livingRoomImg from "@/assets/1 (1).webp";
import bedroomImg from "@/assets/1 (2).webp";
import diningImg from "@/assets/1 (3).webp";
import loungeImg from "@/assets/1 (4).webp";
import facadeImg from "@/assets/1 (5).webp";
import premiumLivingImg from "@/assets/1 (6).webp";

type GalleryItem = {
  src: string;
  label: string;
  caption: string;
};

const buildGallery = (hero: string, galleryImages: string[] = []): GalleryItem[] => {
  const seed = [hero, ...galleryImages, livingRoomImg, bedroomImg, diningImg, loungeImg, facadeImg, premiumLivingImg];
  const unique = seed.filter((src, index) => src && seed.indexOf(src) === index);
  const labels: Array<[string, string]> = [
    ["Front View", "Primary property exterior"],
    ["Living Room", "Warm lounge styling with natural light"],
    ["Bedroom", "Calm, private sleeping space"],
    ["Dining Area", "Open-plan family dining and kitchen flow"],
    ["Lounge", "Relaxed modern family sitting area"],
    ["Facade", "Street-facing exterior presentation"],
    ["Premium Interior", "Signature living space inspiration"],
  ];

  return unique.slice(0, 7).map((src, index) => ({
    src,
    label: labels[index]?.[0] ?? `View ${index + 1}`,
    caption: labels[index]?.[1] ?? "Property inspiration image",
  }));
};

export const Route = createFileRoute("/property/$id")({
  loader: async ({ params }) => {
    if (params.id.startsWith("u-")) {
      const listing = await fetchListingById(params.id.slice(2));
      if (!listing) throw notFound();
      return listing;
    }

    const p = properties.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Property"} | Dang Dream Property` },
      {
        name: "description",
        content: `${loaderData?.name ?? "Property"} in Dang, Nepal. View photos, details, amenities, and contact options from Dang Dream Property.`,
      },
    ],
  }),
  component: PropertyDetail,
  notFoundComponent: () => (
    <div className="pt-[140px] container-luxe text-center pb-20">
      <h1 className="font-display text-3xl font-bold">Property not found</h1>
      <Link to="/properties" className="text-gold mt-4 inline-block">
        <ArrowLeftRight className="w-4 h-4 inline-block mr-1" />
        Back to listings
      </Link>
    </div>
  ),
});

function PropertyDetail() {
  const p = Route.useLoaderData();
  const [tab, setTab] = useState<"overview" | "description" | "amenities" | "map">("overview");
  const [slideIdx, setSlideIdx] = useState(0);
  const [inqLoading, setInqLoading] = useState(false);
  const [inqError, setInqError] = useState<string | null>(null);
  const [inqSuccess, setInqSuccess] = useState(false);

  const gallery = useMemo(() => buildGallery(p.image, p.imageUrls), [p.image, p.imageUrls]);
  const related = useMemo(() => properties.filter((x) => x.id !== p.id).slice(0, 3), [p.id]);
  const activeSlide = gallery[slideIdx] ?? gallery[0];

  useEffect(() => {
    if (String(p.id).startsWith("u-")) {
      void (async () => {
        try {
          const m = await import(`@/lib/${"property-listings.client"}`);
          await m.logPropertyView(String(p.id).slice(2));
        } catch (e) {}
      })();
    }
  }, [p.id]);

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInqError(null);
    setInqLoading(true);

    try {
      if (String(p.id).startsWith("u-")) {
        const m = await import(`@/lib/${"property-listings.client"}`);
        await m.submitPropertyInquiry({
          propertyId: String(p.id).slice(2),
          propertyTitle: p.name,
          name: String(new FormData(e.currentTarget).get("name") ?? "").trim(),
          phone: String(new FormData(e.currentTarget).get("phone") ?? "").trim(),
          email: String(new FormData(e.currentTarget).get("email") ?? "").trim(),
          role: String(new FormData(e.currentTarget).get("role") ?? "Buyer"),
          message: String(new FormData(e.currentTarget).get("message") ?? "").trim(),
        });
      }
      setInqSuccess(true);
      e.currentTarget.reset();
    } catch (error) {
      setInqError(error instanceof Error ? error.message : "Failed to send enquiry.");
    } finally {
      setInqLoading(false);
    }
  };

  const amenities =
    p.amenities?.length > 0
      ? p.amenities
      : [
          "Covered Parking",
          "24hr Water Supply",
          "Boundary Wall",
          "Backup Power",
          "Modern Kitchen",
          "Security",
          "Garden Space",
          "Wide Road Access",
        ];

  return (
    <div className="pt-[100px] pb-20 bg-pearl">
      <div className="container-luxe py-4 text-sm text-muted-foreground flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/properties" className="hover:text-primary">
          Properties
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground min-w-0 truncate">{p.name}</span>
      </div>

      <div className="container-luxe grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-8">
          <section className="space-y-3">
            <div className="rounded-3xl overflow-hidden shadow-card bg-card aspect-[4/3] sm:aspect-[16/10] relative">
              <img src={activeSlide.src} alt={activeSlide.label} className="w-full h-full object-cover" />
              <div className="absolute left-3 top-3 rounded-full bg-black/55 text-white text-[11px] font-semibold px-3 py-1 backdrop-blur">
                {slideIdx + 1} / {gallery.length}
              </div>
              <button
                type="button"
                onClick={() => setSlideIdx((s) => (s - 1 + gallery.length) % gallery.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-card sm:hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setSlideIdx((s) => (s + 1) % gallery.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-card sm:hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 sm:gap-3">
              {gallery.map((item, i) => (
                <button
                  key={`${item.label}-${i}`}
                  type="button"
                  onClick={() => setSlideIdx(i)}
                  className={`group text-left rounded-2xl overflow-hidden border bg-card shadow-card transition ${
                    i === slideIdx ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-gold/50"
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.label}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="px-2.5 py-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-primary truncate">{item.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-card rounded-2xl shadow-card border border-border">
            <div className="flex gap-1 border-b border-border px-2 pt-2 overflow-x-auto no-scrollbar">
              {(["overview", "description", "amenities", "map"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`min-w-max px-5 py-3 text-sm font-semibold capitalize rounded-t-lg transition ${
                    tab === k ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              {tab === "overview" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    ["Type", p.type],
                    ["Transaction", p.txn.toUpperCase()],
                    ["Price", p.price],
                    ["Location", p.location],
                    ["Area", p.area],
                    ["Road", p.road],
                    p.listingState ? ["Status", p.listingState.toUpperCase()] : null,
                    p.featured ? ["Featured", "Yes"] : null,
                    p.beds != null ? ["Bedrooms", String(p.beds)] : null,
                    p.baths != null ? ["Bathrooms", String(p.baths)] : null,
                    p.facing ? ["Facing", p.facing] : null,
                  ]
                    .filter(Boolean)
                    .map(([k, v]: any) => (
                      <div key={k} className="bg-pearl rounded-xl p-4 min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{k}</div>
                        <div className="font-bold mt-1 break-words">{v}</div>
                      </div>
                    ))}
                </div>
              )}

              {tab === "description" && (
                <div className="space-y-6">
                  <p className="text-foreground/80 leading-relaxed break-words">{p.description}</p>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-4">Interior Inspiration Gallery</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {gallery.slice(1).map((item) => (
                        <div key={item.label} className="rounded-2xl overflow-hidden border border-border bg-pearl shadow-card">
                          <div className="aspect-[16/10]">
                            <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4">
                            <div className="font-bold">{item.label}</div>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "amenities" && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-gold rounded-full" />
                      {a}
                    </li>
                  ))}
                </ul>
              )}

              {tab === "map" && (
                <iframe
                  title="Map"
                  className="w-full h-80 rounded-xl border-0"
                  src={p.googleMapsUrl || "https://www.google.com/maps?q=Ghorahi+Dang+Nepal&output=embed"}
                />
              )}
            </div>
          </section>

          <section className="mt-8">
            <EMICalculator defaultAmount={p.priceValue && p.priceValue > 100000 ? Math.round(p.priceValue * 0.8) : 5000000} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-card">
            <div className="text-xs font-bold uppercase tracking-wider text-gold">
              {p.type} · For {p.txn}
            </div>
            <h2 className="font-display text-2xl font-bold mt-1 break-words">{p.name}</h2>
            <div className="text-sm text-muted-foreground flex items-start gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
              <span className="min-w-0 break-words">{p.location}</span>
            </div>
            <div className="font-display text-3xl font-bold text-gradient-gold mt-4">{p.price}</div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-4 border-t border-border pt-4">
              {p.beds != null && (
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5" /> {p.beds}
                </span>
              )}
              {p.baths != null && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" /> {p.baths}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5" /> {p.area}
              </span>
              <span className="flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" /> {p.road}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
              <a
                href={`tel:${PHONE}`}
                className="bg-primary text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <a
                href={`https://wa.me/977${PHONE}?text=Interested in ${encodeURIComponent(p.name)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <button className="sm:col-span-2 border border-border text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" /> Book Site Visit
              </button>
            </div>
          </div>

          <form onSubmit={handleInquirySubmit} className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-card space-y-3">
            <div className="font-display font-bold text-lg">Send an Enquiry</div>
            {inqSuccess ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-success/15 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-success" />
                </div>
                <p className="text-sm text-muted-foreground mt-3">Thanks. We received your enquiry and will contact you soon.</p>
              </div>
            ) : (
              <>
                {inqError && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{inqError}</div>}
                <input name="name" required placeholder="Full Name" className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input name="phone" required type="tel" placeholder="Phone Number" className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none" />
                <input name="email" type="email" placeholder="Email" className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none" />
                <textarea
                  name="message"
                  rows={3}
                  defaultValue={`I am interested in ${p.name}.`}
                  className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none"
                />
                <div className="flex flex-wrap gap-3 text-xs">
                  {["Buyer", "Tenant", "Investor", "Other"].map((o) => (
                    <label key={o} className="flex items-center gap-1">
                      <input type="radio" name="role" defaultChecked={o === "Buyer"} value={o} /> {o}
                    </label>
                  ))}
                </div>
                <button
                  disabled={inqLoading}
                  className="w-full bg-gold-gradient text-primary font-semibold py-3 rounded-xl shadow-gold disabled:opacity-60"
                >
                  {inqLoading ? "Sending..." : "Submit Enquiry"}
                </button>
              </>
            )}
          </form>
        </aside>
      </div>

      <div className="container-luxe mt-16">
        <h3 className="font-display text-2xl font-bold mb-6">More Properties in Dang</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {related.map((r) => (
            <Link
              key={r.id}
              to="/property/$id"
              params={{ id: r.id }}
              className="bg-card rounded-2xl shadow-card border border-border overflow-hidden hover:shadow-luxe transition"
            >
              <img src={r.image || fallbackPropertyImg} loading="lazy" className="h-44 w-full object-cover" alt="" />
              <div className="p-4">
                <div className="font-display font-bold">{r.name}</div>
                <div className="text-sm text-muted-foreground break-words">{r.location}</div>
                <div className="text-gold font-bold mt-2">{r.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
