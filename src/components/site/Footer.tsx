import { Link } from "@tanstack/react-router";
import { Building2, Facebook, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { ADDRESS, EMAIL, PHONES, RECEPTION } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

// Inline TikTok logo (lucide doesn't ship one)
function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.92a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}

const BRANCHES = [
  {
    name: "Ghorahi Head Office",
    address: "Ghorahi-15, Tulsipur Road, Near DK Petrol Pump, Dang",
    phone: "9866970444",
  },
  {
    name: "Tulsipur Branch",
    address: "Tulsipur Sub-Metropolitan City, Dang",
    phone: "9707622512",
  },
];

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-charcoal text-white/85 mt-20">
      {/* Branches strip */}
      <div className="bg-[#0A1F5C] border-b border-white/10">
        <div className="container-luxe py-10 grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Our Branches</div>
            <h3 className="font-display text-2xl text-white font-bold mt-1">Visit Us in Dang</h3>
          </div>
          {BRANCHES.map((b) => (
            <div key={b.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div className="text-sm">
                <div className="font-display text-lg font-bold text-white">{b.name}</div>
                <div className="text-white/70 mt-1">{b.address}</div>
                <a href={`tel:${b.phone}`} className="text-gold font-semibold inline-flex items-center gap-2 mt-2 hover:underline">
                  <Phone className="w-3.5 h-3.5" /> {b.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-luxe py-16 grid gap-10 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-[#1a2f7a] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gold" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-white">Dang Dream</div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-gold">Property</div>
            </div>
          </div>
          <p className="text-sm text-white/70 mb-4">{t("tagline")}</p>
          <p className="text-sm text-white/60 leading-relaxed">
            Dang's most trusted real estate partner — combining deep local expertise with a complete portfolio of property,
            construction, design, finance and insurance services.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href="https://www.facebook.com/profile.php?id=100063556894077"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook — Ghar Jagga Karobar Dang"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@dang.dream.property"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/977${PHONES[0]}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ["Home", "/"],
              ["Properties", "/properties"],
              ["Services", "/services"],
              ["About Us", "/about"],
              ["News", "/news"],
              ["Tools", "/tools"],
              ["Contact", "/contact"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Our Services</h4>
          <ul className="space-y-2.5 text-sm">
            {["Buy Property","Sell Property","Property Exchange","Bank Finance","Rent / Rental","3D Design","Construction","Interior Design","Insurance","Renovation","Naksa / Blueprint"].map((s) => (
              <li key={s}><Link to="/services" className="hover:text-gold transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact Info</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" /><span>{ADDRESS}</span></li>
            {PHONES.map((p) => (
              <li key={p} className="flex gap-3"><Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" /><a href={`tel:${p}`} className="hover:text-gold">{p}</a></li>
            ))}
            <li className="flex gap-3"><Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" /><span>Reception: <a href={`tel:${RECEPTION}`} className="hover:text-gold">{RECEPTION}</a></span></li>
            <li className="flex gap-3"><Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" /><a href={`mailto:${EMAIL}`} className="hover:text-gold break-all">{EMAIL}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-luxe py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/55">
          <span>© {new Date().getFullYear()} Dang Dream Property Real Estate PVT. LTD. All Rights Reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
