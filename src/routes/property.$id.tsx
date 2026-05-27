import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { properties, PHONE, type Property } from "@/lib/data";
import { ChevronRight, ChevronLeft, MapPin, BedDouble, Bath, Maximize, Ruler, Phone, MessageCircle, Calendar, Share2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EMICalculator } from "@/components/site/EMICalculator";
import fallbackPropertyImg from "@/assets/1 (2).webp";
import int1 from "@/assets/1 (1).webp";
import int2 from "@/assets/1 (2).webp";
import int3 from "@/assets/1 (3).webp";
import int4 from "@/assets/1 (4).webp";
import int5 from "@/assets/1 (5).webp";
import int6 from "@/assets/1 (6).webp";

const interiorImages = [int1, int2, int3, int4, int5, int6];


export const Route = createFileRoute("/property/$id")({
  loader: async ({ params }) => {
    if (params.id.startsWith("u-")) {
      const dbId = params.id.slice(2);
      const { data } = await supabase.from("user_properties").select("*").eq("id", dbId).maybeSingle();
      if (!data) throw notFound();
      const p: Property = {
        id: params.id,
        name: data.name,
        type: data.property_type,
        txn: data.txn as Property["txn"],
        price: data.price_text,
        priceValue: Number(data.price_value) || 0,
        location: `${data.location}${data.city ? ", " + data.city : ""}`,
        area: data.area || "",
        beds: data.beds ?? undefined,
        baths: data.baths ?? undefined,
        road: data.road || "",
        facing: data.facing || undefined,
        image: data.image_url || fallbackPropertyImg,
        description: data.description || "",
      };
      return p;
    }
    const p = properties.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "Property"} | Dang Dream Property` }] }),
  component: PropertyDetail,
  notFoundComponent: () => (
    <div className="pt-[140px] container-luxe text-center pb-20">
      <h1 className="font-display text-3xl font-bold">Property not found</h1>
      <Link to="/properties" className="text-gold mt-4 inline-block">← Back to listings</Link>
    </div>
  ),
});

function PropertyDetail() {
  const p = Route.useLoaderData();
  const [tab, setTab] = useState<"overview"|"description"|"amenities"|"map">("overview");
  const [slideIdx, setSlideIdx] = useState(0);

  const related = properties.filter(x => x.id !== p.id).slice(0, 3);

  return (
    <div className="pt-[100px] pb-20 bg-pearl">
      <div className="container-luxe text-sm text-muted-foreground py-4 flex items-center gap-1">
        <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="w-3.5 h-3.5" />
        <Link to="/properties" className="hover:text-primary">Properties</Link><ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{p.name}</span>
      </div>

      <div className="container-luxe grid lg:grid-cols-[1fr_380px] gap-8">
        <div>
          <div className="rounded-3xl overflow-hidden shadow-card bg-card aspect-[16/10]">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[p.image, p.image, p.image, p.image].map((s, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden shadow-card">
                <img src={s} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-8 bg-card rounded-2xl shadow-card border border-border">
            <div className="flex gap-1 border-b border-border px-2 pt-2 overflow-x-auto">
              {(["overview","description","amenities","map"] as const).map(k => (
                <button key={k} onClick={() => setTab(k)} className={`px-5 py-3 text-sm font-semibold capitalize rounded-t-lg ${tab === k ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"}`}>{k}</button>
              ))}
            </div>
            <div className="p-6">
              {tab === "overview" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    ["Type", p.type], ["Transaction", p.txn.toUpperCase()], ["Price", p.price],
                    ["Location", p.location], ["Area", p.area], ["Road", p.road],
                    p.beds != null && ["Bedrooms", String(p.beds)],
                    p.baths != null && ["Bathrooms", String(p.baths)],
                    p.facing && ["Facing", p.facing],
                  ].filter(Boolean).map(([k, v]: any) => (
                    <div key={k} className="bg-pearl rounded-xl p-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{k}</div>
                      <div className="font-bold mt-1">{v}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "description" && (
                <div className="space-y-6">
                  <p className="text-foreground/80 leading-relaxed">{p.description}</p>
                  <div className="mt-6">
                    <h3 className="font-display text-xl font-bold mb-4">Interior View</h3>
                    <div className="relative rounded-2xl overflow-hidden shadow-card aspect-[16/9] group bg-black/5">
                      <img src={interiorImages[slideIdx]} alt="Interior" className="w-full h-full object-cover transition-opacity duration-500" />
                      <button 
                        onClick={() => setSlideIdx(s => (s - 1 + interiorImages.length) % interiorImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-card"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSlideIdx(s => (s + 1) % interiorImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-card"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {interiorImages.map((_, i) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all ${i === slideIdx ? "bg-white w-5" : "bg-white/50 w-1.5"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {tab === "amenities" && (
                <ul className="grid sm:grid-cols-2 gap-3">
                  {["Covered Parking","24hr Water Supply","Boundary Wall","Backup Power","Modern Kitchen","Security","Garden Space","Wide Road Access"].map(a => (
                    <li key={a} className="flex items-center gap-2 text-sm"><span className="w-2 h-2 bg-gold rounded-full" /> {a}</li>
                  ))}
                </ul>
              )}
              {tab === "map" && (
                <iframe title="Map" className="w-full h-80 rounded-xl border-0" src="https://www.google.com/maps?q=Ghorahi+Dang+Nepal&output=embed" />
              )}
            </div>
          </div>

          <div className="mt-8">
            <EMICalculator defaultAmount={p.priceValue && p.priceValue > 100000 ? Math.round(p.priceValue * 0.8) : 5000000} />
          </div>

        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <div className="text-xs font-bold uppercase tracking-wider text-gold">{p.type} · For {p.txn}</div>
            <h2 className="font-display text-2xl font-bold mt-1">{p.name}</h2>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-gold" /> {p.location}</div>
            <div className="font-display text-3xl font-bold text-gradient-gold mt-4">{p.price}</div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-4 border-t border-border pt-4">
              {p.beds != null && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {p.beds}</span>}
              {p.baths != null && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths}</span>}
              <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.area}</span>
              <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {p.road}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <a href={`tel:${PHONE}`} className="bg-primary text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"><Phone className="w-4 h-4" /> Call</a>
              <a href={`https://wa.me/977${PHONE}?text=Interested in ${encodeURIComponent(p.name)}`} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              <button className="col-span-2 border border-border text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5"><Calendar className="w-4 h-4 text-gold" /> Book Site Visit</button>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! We'll contact you within 24 hours."); }} className="bg-card rounded-2xl p-6 border border-border shadow-card space-y-3">
            <div className="font-display font-bold text-lg">Send an Enquiry</div>
            <input required placeholder="Full Name" className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input required type="tel" placeholder="Phone Number" className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none" />
            <input type="email" placeholder="Email" className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none" />
            <textarea rows={3} defaultValue={`I am interested in ${p.name}.`} className="w-full bg-pearl rounded-lg px-3 py-2.5 text-sm outline-none" />
            <div className="flex gap-3 text-xs">
              {["Buyer","Tenant","Investor","Other"].map(o => (
                <label key={o} className="flex items-center gap-1"><input type="radio" name="role" defaultChecked={o === "Buyer"} /> {o}</label>
              ))}
            </div>
            <button className="w-full bg-gold-gradient text-primary font-semibold py-3 rounded-xl shadow-gold">Submit Enquiry</button>
          </form>
        </aside>
      </div>

      <div className="container-luxe mt-16">
        <h3 className="font-display text-2xl font-bold mb-6">More Properties in Dang</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {related.map(r => (
            <Link key={r.id} to="/property/$id" params={{ id: r.id }} className="bg-card rounded-2xl shadow-card border border-border overflow-hidden hover:shadow-luxe transition">
              <img src={r.image} loading="lazy" className="h-44 w-full object-cover" alt="" />
              <div className="p-4">
                <div className="font-display font-bold">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.location}</div>
                <div className="text-gold font-bold mt-2">{r.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
