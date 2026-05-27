import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/data";
import { Heart, MapPin, BedDouble, Bath, Maximize, Ruler } from "lucide-react";

const badgeStyles: Record<Property["txn"], string> = {
  sale: "bg-success text-white",
  rent: "bg-primary text-white",
  exchange: "bg-[#EA580C] text-white",
};
const badgeLabel: Record<Property["txn"], string> = { sale: "SALE", rent: "RENT", exchange: "EXCHANGE" };

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link
      to="/property/$id"
      params={{ id: p.id }}
      className="group block rounded-2xl bg-card shadow-card hover:shadow-luxe transition-all duration-300 overflow-hidden border border-border hover:-translate-y-2"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <span className={`absolute top-3 right-3 ${badgeStyles[p.txn]} text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow`}>{badgeLabel[p.txn]}</span>
        <button onClick={(e) => { e.preventDefault(); }} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white">
          <Heart className="w-4 h-4 text-primary" />
        </button>
        <div className="absolute bottom-3 left-3 bg-charcoal/85 backdrop-blur text-white text-sm font-semibold px-3 py-1.5 rounded-full">
          {p.price}
        </div>
      </div>
      <div className="p-5">
        <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1.5">{p.type}</div>
        <h3 className="font-display text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">{p.name}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="w-3.5 h-3.5 text-gold" /> {p.location}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-3">
          {p.beds != null && (<span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {p.beds} Bed</span>)}
          {p.baths != null && (<span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {p.baths} Bath</span>)}
          <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {p.area}</span>
          <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {p.road}</span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Dang Dream Property</span>
          <span className="text-sm font-semibold text-gold group-hover:translate-x-1 transition-transform">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
