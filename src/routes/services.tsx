import { createFileRoute } from "@tanstack/react-router";
import { services, PHONE } from "@/lib/data";
import {
  Home, TrendingUp, Repeat, Landmark, Key, Box, HardHat, Sofa, ShieldCheck, Hammer, Ruler,
  CheckCircle2, Phone, X
} from "lucide-react";
import { useState } from "react";

const ICONS: Record<string, any> = { Home, TrendingUp, Repeat, Landmark, Key, Box, HardHat, Sofa, ShieldCheck, Hammer, Ruler };

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Our Real Estate Services in Dang | Dang Dream Property" }] }),
  component: ServicesPage,
});

function ServicesPage() {
  const [open, setOpen] = useState<string | null>(null);
  const active = services.find(s => s.id === open);
  return (
    <div className="pt-[100px] pb-20">
      <div className="bg-hero text-white py-16">
        <div className="container-luxe">
          <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">What We Do</div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mt-2">Complete Real Estate Services</h1>
          <p className="text-white/75 mt-4 max-w-2xl">Eleven specialised services that cover every step of your property journey — buying, selling, building, financing and beyond.</p>
        </div>
      </div>

      <div className="container-luxe mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {services.map((s) => {
          const Icon = ICONS[s.icon];
          return (
            <button key={s.id} onClick={() => setOpen(s.id)} id={s.id} className="group text-left bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-luxe hover:-translate-y-2 transition">
              <div className="w-14 h-14 rounded-2xl bg-primary text-gold flex items-center justify-center group-hover:rotate-6 transition"><Icon className="w-6 h-6" /></div>
              <h3 className="font-display font-bold text-lg mt-4">{s.name}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{s.desc}</p>
              <div className="text-sm font-semibold text-gold mt-4">Learn More →</div>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card max-w-2xl w-full rounded-3xl shadow-luxe p-8 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOpen(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-pearl flex items-center justify-center"><X className="w-4 h-4" /></button>
            {(() => {
              const Icon = ICONS[active.icon];
              return (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gold-gradient text-primary flex items-center justify-center"><Icon className="w-8 h-8" /></div>
                  <h2 className="font-display text-3xl font-bold mt-4">{active.name}</h2>
                  <p className="text-foreground/80 mt-3 leading-relaxed">{active.desc} Our dedicated team in Dang manages every detail so you can focus on the outcome — saving time, money and stress at every step.</p>
                  <div className="mt-6">
                    <div className="font-bold mb-3">Key Benefits</div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {["Transparent pricing","Expert local consultation","100% verified documentation","Dedicated relationship manager","Bank-grade legal compliance","After-service support"].map(b => (
                        <div key={b} className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> {b}</div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="font-bold mb-3">Our Process</div>
                    <ol className="grid sm:grid-cols-4 gap-3">
                      {["Consultation","Site Visit","Documentation","Handover"].map((step, i) => (
                        <li key={step} className="bg-pearl rounded-xl p-3 text-center text-sm">
                          <div className="text-gold font-bold">Step {i + 1}</div>
                          <div className="font-semibold mt-1">{step}</div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={`tel:${PHONE}`} className="bg-primary text-white font-semibold px-5 py-3 rounded-full inline-flex items-center gap-2"><Phone className="w-4 h-4" /> Call Us Now</a>
                    <button className="bg-gold-gradient text-primary font-semibold px-5 py-3 rounded-full">📋 Request This Service</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
