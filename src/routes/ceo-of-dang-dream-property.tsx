import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import ceoImg from "@/assets/Sir.jpg";

const SITE_NAME = "Dang Dream Property";
const CEO_NAME = "Shekhar Chhetru";
const SITE_URL = import.meta.env.VITE_SITE_URL?.trim() || "http://localhost:3000";
const CEO_IMAGE_URL = new URL(ceoImg, SITE_URL).toString();

export const Route = createFileRoute("/ceo-of-dang-dream-property")({
  head: () => ({
    links: [
      { rel: "canonical", href: `${SITE_URL}/ceo-of-dang-dream-property` },
    ],
    meta: [
      { charSet: "utf-8" },
      { name: "description", content: "Meet Shekhar Chhetru, CEO of Dang Dream Property. Learn about his vision, leadership, and the team helping families and investors across Dang, Nepal." },
      { name: "keywords", content: "CEO of DangDreamProperty, Dang Dream Property CEO, Shekhar Chhetru, real estate Dang Nepal, Dang Dream Property team" },
      { property: "og:title", content: "CEO of Dang Dream Property | Shekhar Chhetru" },
      { property: "og:description", content: "Read the profile of Shekhar Chhetru, CEO & Founder of Dang Dream Property, and meet the team behind the company." },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: CEO_IMAGE_URL },
      { property: "og:image:alt", content: "Shekhar Chhetru, CEO of Dang Dream Property" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CEO of Dang Dream Property | Shekhar Chhetru" },
      { name: "twitter:description", content: "Meet the CEO, founder, and leadership team of Dang Dream Property." },
      { name: "twitter:image", content: CEO_IMAGE_URL },
      { name: "robots", content: "index,follow,max-image-preview:large" },
    ],
  }),
  component: CEOPage,
});

function CEOPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        name: SITE_NAME,
        url: SITE_URL,
        image: CEO_IMAGE_URL,
        description:
          "Dang Dream Property helps families and investors buy, sell, and manage real estate across Dang, Nepal.",
      },
      {
        "@type": "Person",
        name: CEO_NAME,
        jobTitle: "CEO & Founder",
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        image: CEO_IMAGE_URL,
        url: `${SITE_URL}/ceo-of-dang-dream-property`,
        sameAs: [SITE_URL],
      },
      {
        "@type": "WebPage",
        name: "CEO of Dang Dream Property",
        url: `${SITE_URL}/ceo-of-dang-dream-property`,
        description:
          "CEO profile and team page for Dang Dream Property.",
      },
    ],
  };

  const team = [
    {
      name: "Shekhar Chhetru",
      role: "CEO & Founder",
      detail:
        "Leads the company vision, client relationships, and local real estate strategy across Dang.",
    },
    {
      name: "Damudar Bhandari",
      role: "Property Manager",
      detail:
        "Coordinates listings, client visits, and property verification so buyers get accurate, trusted information.",
    },
    {
      name: "Suresh Gharti Magar",
      role: "Manager",
      detail:
        "Supports operations, coordination, and day-to-day service delivery for property buyers and sellers.",
    },
  ];

  return (
    <div className="pt-[100px] pb-20 bg-pearl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="bg-hero text-white">
        <div className="container-luxe py-16 lg:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Leadership</div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold mt-3 leading-tight">
              CEO of Dang Dream Property
            </h1>
            <p className="mt-5 text-white/80 max-w-2xl leading-relaxed">
              Meet {CEO_NAME}, the CEO & Founder of {SITE_NAME}. This page is designed for search,
              credibility, and easy sharing so clients can quickly learn who leads the company and who
              supports the team.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gold-gradient text-primary font-semibold px-6 py-3 rounded-full shadow-gold hover:scale-105 transition"
              >
                Contact Team <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:9866970444"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition"
              >
                <Phone className="w-4 h-4" />
                9866970444
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-luxe bg-white/5 ring-1 ring-white/10">
              <img src={ceoImg} alt="Shekhar Chhetru, CEO of Dang Dream Property" className="w-full h-[560px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card text-foreground rounded-2xl shadow-card border border-border p-5 max-w-xs hidden md:block">
              <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Company focus</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Verified listings, local expertise, construction guidance, and real support for families in Dang.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe mt-14">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">About the CEO</div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary mt-3">
              {CEO_NAME} - {SITE_NAME}
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed">
              {CEO_NAME} leads {SITE_NAME} with a simple belief: real estate should feel trustworthy, transparent,
              and deeply local. His work focuses on helping buyers, sellers, and investors make confident decisions
              in Dang and the surrounding market.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {[
                "Local market expertise in Dang",
                "Verified property guidance",
                "Client-first communication",
                "End-to-end real estate support",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Leadership Team</div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary mt-3">People behind the work</h2>
            <div className="space-y-4 mt-6">
              {team.map((member) => (
                <div key={member.name} className="rounded-2xl border border-border p-5 bg-pearl">
                  <div className="font-display text-xl font-bold text-primary">{member.name}</div>
                  <div className="text-sm font-semibold text-gold mt-1">{member.role}</div>
                  <p className="text-sm text-foreground/75 leading-relaxed mt-3">{member.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe mt-14">
        <div className="bg-hero text-white rounded-3xl p-8 lg:p-10 shadow-luxe">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Why this page exists</div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mt-3">Built for search and trust</h2>
              <p className="mt-4 text-white/80 leading-relaxed">
                A dedicated CEO page gives search engines a clear signal for terms like “CEO of Dang Dream Property”
                and gives visitors a direct place to learn who runs the company before contacting us.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-gold-gradient text-primary font-semibold px-6 py-3 rounded-full shadow-gold hover:scale-105 transition"
              >
                Read Company Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
