import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import heroMobileImg from "@/assets/Hero-image-for-mobile.jpg";
import ceoImg from "@/assets/Sir.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Dang Dream Property | Real Estate in Dang, Nepal" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-[100px] pb-20">
      <div className="bg-hero text-white py-16">
        <div className="container-luxe">
          <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Our Story</div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mt-2">About Dang Dream Property</h1>
          <p className="text-white/75 mt-4 max-w-2xl">Born in Dang, built for Dang. We exist to help families and investors make confident property decisions in Nepal's fastest-growing region.</p>
        </div>
      </div>

      <div className="container-luxe mt-14 grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center">
        <img src={heroMobileImg} className="rounded-3xl shadow-luxe object-cover aspect-square" alt="Dang valley" />
        <div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary">Dang's Most Trusted Real Estate Partner</h2>
          <p className="mt-4 text-foreground/80 leading-relaxed">From verified property listings to construction, design, finance and insurance — we bring all the essential real estate services into one trusted brand. Over a decade in the Dang market has given us unmatched local insight and a network of clients, banks and contractors who believe in doing things the right way.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            {["10+ years of local expertise","100% verified listings","Bank finance support","3D design before you build","Trusted by 1,200+ families","Complete service under one roof"].map(x => (
              <div key={x} className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-gold shrink-0" /><span>{x}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-luxe mt-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { n: "Shekhar Chhetru", r: "CEO & Founder", img: ceoImg },
            { n: "Damudar Bhandari", r: "Property Manager" },
            { n: "Suresh Gharti Magar", r: "Manager" },
          ].map(m => (
            <div key={m.n} className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
              {m.img ? (
                <img src={m.img} alt={m.n} className="w-24 h-24 mx-auto rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-[#1a2f7a] flex items-center justify-center text-gold font-display text-3xl font-bold">
                  {m.n.split(" ").map(x => x[0]).slice(0, 2).join("")}
                </div>
              )}
              <div className="font-display text-lg font-bold mt-4">{m.n}</div>
              <div className="text-sm text-muted-foreground">{m.r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
