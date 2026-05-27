import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { properties as mockProperties, type Property } from "@/lib/data";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import fallbackPropertyImg from "@/assets/1 (2).webp";

type Search = { q?: string; type?: string; budget?: string; tab?: string };

export const Route = createFileRoute("/properties")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
    budget: typeof s.budget === "string" ? s.budget : undefined,
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
  head: () => ({ meta: [{ title: "All Properties in Dang | Dang Dream Property" }] }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  const [type, setType] = useState(search.type ?? "");
  const [tab, setTab] = useState(search.tab ?? "all");
  const [q, setQ] = useState(search.q ?? "");
  const [sort, setSort] = useState("latest");
  const [userListings, setUserListings] = useState<Property[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("user_properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (!data) return;
      setUserListings(
        data.map((r: any) => ({
          id: `u-${r.id}`,
          name: r.name,
          type: r.property_type,
          txn: r.txn,
          price: r.price_text,
          priceValue: Number(r.price_value) || 0,
          location: `${r.location}${r.city ? ", " + r.city : ""}`,
          area: r.area || "",
          beds: r.beds ?? undefined,
          baths: r.baths ?? undefined,
          road: r.road || "",
          facing: r.facing || undefined,
          image: r.image_url || fallbackPropertyImg,
          description: r.description || "",
        }))
      );
    })();
  }, []);

  const filtered = useMemo(() => {
    let list: Property[] = [...userListings, ...mockProperties];
    if (tab !== "all") list = list.filter((p) => p.txn === tab);
    if (type) list = list.filter((p) => p.type.toLowerCase().includes(type.toLowerCase()));
    if (q) list = list.filter((p) => (p.location + p.name).toLowerCase().includes(q.toLowerCase()));
    if (sort === "low") list.sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "high") list.sort((a, b) => b.priceValue - a.priceValue);
    return list;
  }, [tab, type, q, sort, userListings]);

  return (
    <div className="pt-[100px] pb-20">
      <div className="bg-hero text-white py-12 mb-10">
        <div className="container-luxe">
          <div className="text-sm text-white/70 flex items-center gap-1"><Link to="/" className="hover:text-gold">Home</Link> <ChevronRight className="w-3.5 h-3.5" /> Properties</div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mt-2">All Properties in Dang</h1>
          <p className="text-white/75 mt-2">Verified listings across Ghorahi, Tulsipur, Lamahi and more.</p>
        </div>
      </div>

      <div className="container-luxe grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="bg-card rounded-2xl p-6 border border-border shadow-card h-fit sticky top-24">
          <div className="flex items-center gap-2 font-bold mb-5"><SlidersHorizontal className="w-4 h-4 text-gold" /> Filters</div>
          <div className="space-y-5 text-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Transaction</label>
              <div className="grid grid-cols-2 gap-1">
                {[["all","All"],["sale","Buy"],["rent","Rent"],["exchange","Exchange"]].map(([k,l]) => (
                  <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${tab === k ? "bg-primary text-white" : "bg-pearl text-foreground hover:bg-pearl/70"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Property Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-pearl rounded-lg px-3 py-2.5 outline-none">
                <option value="">All Types</option>
                {["House","Land","Apartment","Office Space","Shop Space","Farm Land"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Location / Keyword</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ghorahi, Tulsipur…" className="w-full bg-pearl rounded-lg px-3 py-2.5 outline-none text-sm" />
            </div>
            <button onClick={() => { setType(""); setQ(""); setTab("all"); }} className="text-xs text-gold font-semibold">Clear All</button>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="text-sm text-muted-foreground">Showing <span className="font-bold text-foreground">{filtered.length}</span> properties</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none">
              <option value="latest">Sort: Latest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-16 text-center text-muted-foreground">No properties match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <PropertyCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
