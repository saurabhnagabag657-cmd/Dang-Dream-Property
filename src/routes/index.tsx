import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Search, MapPin, ChevronRight, Home, TreePine, Building2, Store, Briefcase, Sprout,
  TrendingUp, Repeat, Landmark, Key, Box, HardHat, Sofa, ShieldCheck, Hammer, Ruler,
  CheckCircle2, Star, Plus, Phone, BedDouble, Bath, Maximize, ArrowRight,
} from "lucide-react";
import heroMobileImg from "@/assets/Hero-image-for-mobile.jpg";
import heroPcImg from "@/assets/nepal_real_estate_hero.png";
import houseDesignImg from "@/assets/house-design.jpg";
import houseGreyImg from "@/assets/699676492139465632.jpg";
import houseWhiteImg from "@/assets/723390758934520248.webp";
import ruralHouseImg from "@/assets/1 (1).webp";
import familyHouseImg from "@/assets/1 (2).webp";
import commercialHouseImg from "@/assets/1 (4).webp";
import frontageHouseImg from "@/assets/1 (5).webp";
import villaHouseImg from "@/assets/Experience the captivating elegance of the….webp";
import ceoImg from "@/assets/Sir.jpg";
import { useI18n } from "@/lib/i18n";
import { categories, properties, services, locations, testimonials, faqs, news, PHONE } from "@/lib/data";
import { PropertyCard } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dang Dream Property — Premium Real Estate in Dang, Nepal" },
      { name: "description", content: "Find houses, land, apartments and commercial properties in Ghorahi, Tulsipur, Lamahi and across Dang. Dang's #1 trusted real estate partner." },
    ],
  }),
  component: HomePage,
});

const ICONS: Record<string, any> = { Home, TreePine, Building2, Store, Briefcase, Sprout, TrendingUp, Repeat, Landmark, Key, Box, HardHat, Sofa, ShieldCheck, Hammer, Ruler };

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <Services />
      <WhyUs />
      <Locations />
      <BudgetCollection />
      <CEO />
      <Testimonials />
      <NewsSection />
      <FAQ />
      <ContactBanner />
    </>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [tab, setTab] = useState<"buy" | "rent" | "exchange" | "finance">("buy");
  const [loc, setLoc] = useState(""); const [type, setType] = useState(""); const [budget, setBudget] = useState("");

  return (
    <section className="relative min-h-screen bg-hero text-white overflow-hidden pt-[88px] lg:pt-[100px] pb-20">
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <img
          src={heroMobileImg}
          alt="Nepali hillside property road"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/40 to-primary/85" />
      </div>
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/40 blur-3xl" />

      <div className="container-luxe relative grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="inline-flex items-center gap-2 bg-gold/15 text-gold border border-gold/30 px-4 py-1.5 rounded-full text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-gold" /> {t("hero_badge")}
          </span>
          <h1 className="font-display text-[44px] sm:text-[58px] lg:text-[78px] font-bold leading-[1.05] tracking-tight mt-5">
            {t("hero_title_1")}
            <br /><span className="text-gradient-gold">{t("hero_title_2")}</span>
          </h1>
          <p className="mt-5 text-white/75 text-base lg:text-lg max-w-xl leading-relaxed">
            {t("hero_sub")}
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <Link to="/properties" className="bg-gold-gradient text-primary font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2 shadow-gold hover:scale-105 transition">
              {t("cta_explore")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition">
              {t("cta_services")}
            </Link>
          </div>

          {/* Search */}
          <div
            className="mt-9 text-foreground rounded-2xl p-2 max-w-[780px]"
            style={{
              background: "rgba(255,255,255,0.98)",
              border: "2px solid rgba(201,168,76,0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <div className="flex gap-1 p-2 rounded-t-[10px]" style={{ background: "#F4F6FA" }}>
              {(["buy","rent","exchange","finance"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`px-5 py-2.5 text-xs font-semibold rounded-[10px] transition ${
                    tab === k ? "bg-[#0A1F5C] text-white" : "text-[#0A1F5C] hover:bg-[rgba(10,31,92,0.08)]"
                  }`}
                  style={tab !== k ? { background: "rgba(10,31,92,0.08)" } : undefined}
                >
                  {t(`tab_${k}` as any)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr_auto] gap-3 p-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#0A1F5C] uppercase tracking-[0.5px] mb-1.5">Location</label>
                <div className="flex items-center gap-2 bg-white rounded-[10px] px-3.5 py-3 border-[1.5px] border-[#D1D5DB] focus-within:border-[#0A1F5C] focus-within:ring-[3px] focus-within:ring-[rgba(10,31,92,0.15)] transition">
                  <MapPin className="w-4 h-4 text-[#0A1F5C]" />
                  <input
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                    placeholder={t("search_location")}
                    className="bg-transparent text-[15px] w-full outline-none text-[#111827] placeholder:text-[#6B7280]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#0A1F5C] uppercase tracking-[0.5px] mb-1.5">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white rounded-[10px] px-3 py-3 text-[15px] outline-none border-[1.5px] border-[#D1D5DB] text-[#111827] focus:border-[#0A1F5C] focus:ring-[3px] focus:ring-[rgba(10,31,92,0.15)] transition"
                >
                  <option value="">{t("search_type")}</option>
                  <option>House</option><option>Land</option><option>Apartment</option><option>Office Space</option><option>Shop Space</option><option>Farm Land</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#0A1F5C] uppercase tracking-[0.5px] mb-1.5">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-white rounded-[10px] px-3 py-3 text-[15px] outline-none border-[1.5px] border-[#D1D5DB] text-[#111827] focus:border-[#0A1F5C] focus:ring-[3px] focus:ring-[rgba(10,31,92,0.15)] transition"
                >
                  <option value="">{t("search_budget")}</option>
                  <option>Under 20 Lakh</option><option>20–50 Lakh</option><option>50L–1 Cr</option><option>1–3 Cr</option><option>Above 3 Cr</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => nav({ to: "/properties", search: { q: loc, type, budget, tab } as any })}
                  className="w-full sm:w-auto h-[52px] sm:h-auto px-7 py-[14px] rounded-[10px] font-bold text-base text-[#0A1F5C] inline-flex items-center justify-center gap-2 hover:brightness-110 hover:scale-[1.02] transition shadow-gold"
                  style={{ background: "linear-gradient(135deg,#C9A84C,#E8C46A)" }}
                >
                  <Search className="w-4 h-4" /> {t("btn_search")}
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-8">
            {[
              { n: "500+", label: t("stat_properties") },
              { n: "1,200+", label: t("stat_clients") },
              { n: "15+", label: t("stat_locations") },
              { n: "98%", label: t("stat_satisfaction") },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl lg:text-3xl font-bold text-gold">{s.n}</div>
                <div className="text-[11px] lg:text-xs text-white/70 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual */}
        <div className="relative hidden lg:block">
          <div className="relative rounded-3xl overflow-hidden shadow-luxe ring-1 ring-white/10">
            <img src={heroPcImg} alt="Nepali landmark property landscape" className="w-full h-[560px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
          </div>
          <div className="absolute -left-6 top-10 glass rounded-2xl px-4 py-3 shadow-card animate-float-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success" /></div>
              <div>
                <div className="text-[11px] text-muted-foreground">Status</div>
                <div className="text-sm font-bold text-foreground">Verified Property</div>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 bottom-16 glass rounded-2xl px-4 py-3 shadow-card animate-float-slower">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-gold" /></div>
              <div>
                <div className="text-[11px] text-muted-foreground">Dang market</div>
                <div className="text-sm font-bold text-foreground">+30% Growth ’24</div>
              </div>
            </div>
          </div>
          <div className="absolute right-10 -bottom-6 glass rounded-2xl px-4 py-3 shadow-card animate-float-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center"><Landmark className="w-5 h-5 text-primary" /></div>
              <div>
                <div className="text-[11px] text-muted-foreground">Finance</div>
                <div className="text-sm font-bold text-foreground">Bank Loan Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CATEGORIES ---------- */
function Categories() {
  const { t } = useI18n();
  return (
    <section className="py-20 bg-pearl">
      <div className="container-luxe">
        <SectionHead eyebrow="Property Types" title={t("section_browse")} sub={t("section_browse_sub")} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
          {categories.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <Link key={c.key} to="/properties" search={{ type: c.key } as any} className="group bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-luxe hover:-translate-y-2 transition-all border border-border">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-gold/15 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-display font-bold text-foreground">{c.key}</div>
                <div className="text-xs text-gold font-semibold mt-1">{c.count}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURED ---------- */
function Featured() {
  const { t } = useI18n();
  return (
    <section className="py-20">
      <div className="container-luxe">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <SectionHead eyebrow="⭐ Featured" title={t("section_featured")} sub={t("section_featured_sub")} align="left" />
          <Link to="/properties" className="text-sm font-semibold text-primary hover:text-gold inline-flex items-center gap-1">
            {t("view_all")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {properties.slice(0, 4).map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>

        <h3 className="font-display text-2xl font-bold mt-16 mb-6">🔥 Recently Listed Properties</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.slice(4, 8).map((p) => (
            <Link key={p.id} to="/property/$id" params={{ id: p.id }} className="group flex bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-luxe border border-border transition">
              <div className="w-2/5 relative overflow-hidden">
                <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-charcoal/85 text-white text-[10px] px-2 py-1 rounded-full font-semibold">{p.price}</span>
              </div>
              <div className="flex-1 p-5">
                <div className="text-[11px] text-primary font-bold uppercase tracking-wider">{p.type}</div>
                <div className="font-display text-lg font-bold mt-1 group-hover:text-primary transition">{p.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-gold" /> {p.location}</div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-3">
                  {p.beds != null && <span className="flex gap-1 items-center"><BedDouble className="w-3.5 h-3.5" />{p.beds}</span>}
                  {p.baths != null && <span className="flex gap-1 items-center"><Bath className="w-3.5 h-3.5" />{p.baths}</span>}
                  <span className="flex gap-1 items-center"><Maximize className="w-3.5 h-3.5" />{p.area}</span>
                </div>
                <div className="text-sm font-semibold text-gold mt-4 group-hover:translate-x-1 transition-transform">View Details →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICES ---------- */
function Services() {
  const { t } = useI18n();
  return (
    <section className="py-20 bg-pearl">
      <div className="container-luxe">
        <SectionHead eyebrow="Services" title={t("section_services")} sub={t("section_services_sub")} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <Link key={s.id} to="/services" hash={s.id} className="group bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-luxe hover:-translate-y-2 transition relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-gold/0 group-hover:from-primary/5 group-hover:to-gold/10 transition" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-gold flex items-center justify-center shadow group-hover:rotate-6 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg mt-4">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
                  <div className="mt-4 text-sm font-semibold text-gold inline-flex items-center gap-1 group-hover:translate-x-1 transition">Learn More <ChevronRight className="w-3.5 h-3.5" /></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- WHY US ---------- */
function WhyUs() {
  const { t } = useI18n();
  const reasons = [
    { t: "10+ Years of Local Expertise", d: "Deep knowledge of Dang's market — every ward, every road, every value." },
    { t: "100% Verified Listings", d: "Every property is physically verified before listing. No fake entries." },
    { t: "Complete Service Under One Roof", d: "From buying and selling to construction, interior, and insurance — we handle it." },
    { t: "Bank Finance Support", d: "We coordinate with partner banks to simplify your home loan process." },
    { t: "3D Design Before You Build", d: "Visualize your dream home in 3D before a single brick is laid." },
    { t: "Trusted by 1,200+ Families", d: "Across Ghorahi, Tulsipur, Lamahi and all of Dang district." },
  ];
  return (
    <section className="py-20">
      <div className="container-luxe grid lg:grid-cols-2 gap-12 items-center">
        <div className="grid grid-cols-2 gap-3">
          {[
            houseDesignImg,
            familyHouseImg,
            houseWhiteImg,
            frontageHouseImg,
          ].map((src, i) => (
            <img key={src} src={src} loading="lazy" alt="Dang property" className={`rounded-2xl object-cover shadow-card ${i % 2 === 0 ? "h-64 mt-8" : "h-56"}`} />
          ))}
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Why Choose Us</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-primary mt-2">{t("section_why")}</h2>
          <div className="mt-8 space-y-5">
            {reasons.map((r) => (
              <div key={r.t} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gold-gradient flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
                <div>
                  <div className="font-bold">{r.t}</div>
                  <div className="text-sm text-muted-foreground">{r.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- LOCATIONS ---------- */
function Locations() {
  const { t } = useI18n();
  return (
    <section className="py-20 bg-pearl">
      <div className="container-luxe">
        <SectionHead eyebrow="Explore Dang" title={t("section_locations")} sub="Dang's Most Sought-After Areas" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {locations.map((l) => (
            <Link to="/properties" search={{ q: l.name } as any} key={l.name} className="group relative h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-luxe transition">
              <img src={l.image} alt={l.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              <div className="absolute top-4 right-4 bg-gold text-primary text-[11px] font-bold px-2.5 py-1 rounded-full">{l.count}</div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="font-display text-2xl font-bold">{l.name}</div>
                <div className="text-sm text-white/80 inline-flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">Explore <ArrowRight className="w-3.5 h-3.5" /></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BUDGET ---------- */
function BudgetCollection() {
  const { t } = useI18n();
  const cards = [
    { title: "Land / Plot Below 50 Lakh", cta: "View Available Plots", grad: "from-primary/90 to-primary/60", img: ruralHouseImg },
    { title: "Houses Under 1 Crore", cta: "View Available Houses", grad: "from-success/90 to-success/60", img: houseGreyImg },
    { title: "Commercial Properties — All Budgets", cta: "View Commercial Listings", grad: "from-gold/90 to-[#a8862e]/80", img: commercialHouseImg },
  ];
  return (
    <section className="py-20">
      <div className="container-luxe">
        <SectionHead eyebrow="Useful Collection" title={t("section_budget")} sub="Find your perfect match — within your range" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {cards.map((c) => (
            <Link to="/properties" key={c.title} className="group relative h-72 rounded-3xl overflow-hidden shadow-card hover:shadow-luxe transition">
              <img src={c.img} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
              <div className={`absolute inset-0 bg-gradient-to-br ${c.grad} mix-blend-multiply`} />
              <div className="absolute inset-0 p-7 flex flex-col justify-end text-white">
                <div className="font-display text-2xl font-bold leading-tight">{c.title}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">{c.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CEO ---------- */
function CEO() {
  const { t } = useI18n();
  return (
    <section className="py-20 bg-pearl">
      <div className="container-luxe grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-luxe aspect-[4/5]">
            <img src={ceoImg} alt="CEO Shekhar Chhetru" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -right-5 bg-gold-gradient text-primary p-5 rounded-2xl shadow-gold hidden sm:block">
            <div className="font-display text-3xl font-bold">10+</div>
            <div className="text-xs font-semibold">Years of Trust</div>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">From the Desk of CEO</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-primary mt-2">{t("ceo_title")}</h2>
          <p className="mt-6 text-lg text-foreground/80 leading-relaxed font-serif italic">
            “Real estate is not just about buying and selling property — it is about helping families build their futures,
            secure their investments, and find a place they can proudly call home. At Dang Dream Property, our mission is to
            bring world-class real estate services to Dang — with honesty, transparency, and deep local expertise.”
          </p>
          <div className="mt-6">
            <div className="font-display text-xl font-bold">Shekhar Chhetru</div>
            <div className="text-sm text-muted-foreground">CEO & Founder, Dang Dream Property Real Estate PVT. LTD</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/ceo-of-dang-dream-property"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition shadow-luxe"
            >
              View CEO Profile <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-border bg-white px-5 py-3 rounded-full text-sm font-semibold text-foreground hover:bg-gray-50 transition"
            >
              About the Company
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { n: "Shekhar Chhetru", r: "CEO & Founder" },
              { n: "Damudar Bhandari", r: "Property Manager" },
              { n: "Suresh Gharti Magar", r: "Manager" },
            ].map((m) => (
              <div key={m.n} className="bg-card rounded-2xl p-4 border border-border text-center shadow-card">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-[#1a2f7a] flex items-center justify-center text-gold font-display text-xl font-bold">{m.n.split(" ").map(x => x[0]).slice(0,2).join("")}</div>
                <div className="text-sm font-bold mt-3 leading-tight">{m.n}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{m.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let x = 0; let paused = false;
    el.addEventListener("mouseenter", () => (paused = true));
    el.addEventListener("mouseleave", () => (paused = false));
    const id = setInterval(() => {
      if (paused || !el) return;
      x += 1; if (x >= el.scrollWidth - el.clientWidth) x = 0;
      el.scrollTo({ left: x });
    }, 30);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="py-20">
      <div className="container-luxe">
        <SectionHead eyebrow="Testimonials" title={t("section_testimonials")} sub="Real stories from real families across Dang" />
        <div ref={ref} className="mt-10 flex gap-5 overflow-x-auto pb-4 snap-x scroll-smooth no-scrollbar">
          {[...testimonials, ...testimonials].map((tm, i) => (
            <div key={i} className="min-w-[320px] sm:min-w-[420px] bg-card rounded-2xl p-7 border border-border shadow-card snap-start">
              <div className="font-display text-5xl text-gold leading-none">“</div>
              <p className="text-foreground/80 mt-2 leading-relaxed">{tm.text}</p>
              <div className="flex gap-0.5 mt-4">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <div className="font-bold">{tm.name}</div>
                <div className="text-xs text-muted-foreground">{tm.role} · {tm.loc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- NEWS ---------- */
function NewsSection() {
  const { t } = useI18n();
  const imgs = [heroMobileImg, commercialHouseImg, villaHouseImg, heroPcImg];
  return (
    <section className="py-20 bg-pearl">
      <div className="container-luxe">
        <SectionHead eyebrow="Insights" title={t("section_news")} sub="Stay informed about Dang's growing property market" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {news.map((n, i) => (
            <Link to="/news" key={n.title} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-luxe border border-border transition hover:-translate-y-1">
              <div className="relative h-44 overflow-hidden">
                <img src={imgs[i]} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white text-primary text-[11px] font-bold px-2.5 py-1 rounded-full">{n.date}</div>
                <div className="absolute top-3 right-3 bg-gold text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{n.category}</div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg leading-snug group-hover:text-primary transition">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{n.excerpt}</p>
                <div className="text-sm font-semibold text-gold mt-4">Read More →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20">
      <div className="container-luxe max-w-3xl">
        <SectionHead eyebrow="Help Center" title={t("section_faq")} sub="Answers to questions Dang families ask us every day" />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full text-left bg-card border border-border rounded-2xl p-5 shadow-card transition hover:border-gold/40">
              <div className="flex items-start justify-between gap-4">
                <span className="font-display font-bold text-lg">{f.q}</span>
                <Plus className={`w-5 h-5 text-gold shrink-0 transition-transform ${open === i ? "rotate-45" : ""}`} />
              </div>
              <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT BANNER ---------- */
function ContactBanner() {
  return (
    <section className="py-16">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-3xl bg-hero text-white p-10 lg:p-14 shadow-luxe">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Can't find it?</div>
              <h2 className="font-display text-3xl lg:text-5xl font-bold mt-2 leading-tight">Didn't find the property of your choice?</h2>
              <p className="mt-3 text-white/80">Tell us your requirements — our team will find the perfect match across Dang.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/contact" className="bg-gold-gradient text-primary font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2 shadow-gold hover:scale-105 transition">📋 Request a Property</Link>
              <a href={`tel:${PHONE}`} className="border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:bg-white/10 transition"><Phone className="w-4 h-4" /> {PHONE}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */
function SectionHead({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: string; sub?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : ""}>
      <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">{eyebrow}</div>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-2 leading-tight">{title}</h2>
      {sub && <p className="text-muted-foreground mt-3">{sub}</p>}
    </div>
  );
}
