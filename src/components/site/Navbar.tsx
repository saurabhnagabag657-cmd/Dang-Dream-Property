import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Globe, Building2, User as UserIcon, LogIn, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { PHONE } from "@/lib/data";

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);


  const links: Array<{ to: string; key: any }> = [
    { to: "/", key: "nav_home" },
    { to: "/properties", key: "nav_properties" },
    { to: "/services", key: "nav_services" },
    { to: "/about", key: "nav_about" },
    { to: "/tools", key: "nav_tools" },
    { to: "/news", key: "nav_news" },
    { to: "/contact", key: "nav_contact" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-white/15 ${
        scrolled
          ? "bg-[rgba(10,31,92,0.97)] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
          : "bg-[#0A1F5C] shadow-[0_2px_20px_rgba(0,0,0,0.25)]"
      }`}
      style={{ backdropFilter: scrolled ? "blur(20px) saturate(180%)" : undefined }}
    >
      <div className="container-luxe flex items-center justify-between h-[72px] lg:h-[80px]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a2f7a] to-[#0A1F5C] ring-1 ring-gold/40 flex items-center justify-center shadow-luxe">
            <Building2 className="w-6 h-6 text-gold" strokeWidth={2.2} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gold-gradient ring-2 ring-[#0A1F5C]" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[18px] lg:text-[20px] font-bold text-white">Dang Dream</div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-gold">Property</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="relative px-3 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors group data-[status=active]:text-gold"
            >
              {t(l.key)}
              <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "ne" : "en")}
            className="flex items-center gap-1.5 h-10 px-3 rounded-full bg-white/10 hover:bg-gold hover:text-[#0A1F5C] border border-gold/60 text-gold transition-colors"
            aria-label={`Switch language (current: ${lang === "en" ? "English" : "Nepali"})`}
            title={lang === "en" ? "Switch to नेपाली" : "Switch to English"}
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider">{lang === "en" ? "EN" : "ने"}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/40 text-white hover:bg-white/10">
                <UserIcon className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/40 text-white hover:bg-white/10"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/40 text-white hover:bg-white/10">
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}
          <Link
            to={user ? "/list-property" : "/signup"}
            className="bg-gold-gradient text-[#0A1F5C] px-[22px] py-[10px] rounded-[24px] text-sm font-bold shadow-gold hover:scale-[1.03] transition-transform"
          >
            {user ? "+ List Property" : t("cta_list")}
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "ne" : "en")}
            className="flex items-center gap-1.5 h-10 px-3 rounded-full bg-white/10 border border-gold/60 text-gold"
            aria-label="Toggle language"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider">{lang === "en" ? "EN" : "ने"}</span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-lg bg-gold-gradient text-[#0A1F5C] flex items-center justify-center shadow-gold"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] text-white overflow-y-auto no-scrollbar ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        style={{ backgroundColor: "#0A1F5C", minHeight: "100vh", transition: "transform 400ms cubic-bezier(0.32, 0.72, 0, 1)" }}
      >


        <div className="flex items-center justify-between h-[72px] px-5 border-b border-white/10">
          <div className="font-display text-xl font-bold">Dang Dream Property</div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Prominent Language Card — second item */}
        <div className="p-5">
          <div className="bg-white/5 border border-white/15 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                <Globe className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="font-semibold text-[15px]">Language / भाषा</div>
                <div className="text-xs text-white/60 mt-0.5">
                  {lang === "en" ? "Currently: English" : "हाल: नेपाली"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === "en" ? "ne" : "en")}
              role="switch"
              aria-checked={lang === "ne"}
              className={`relative h-7 w-14 shrink-0 rounded-full ${
                lang === "ne" ? "bg-gold-gradient" : "bg-white/10 border border-white/40"
              }`}
              style={{ transition: "background-color 300ms ease" }}
            >
              <span
                className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md"
                style={{
                  transform: lang === "ne" ? "translateX(28px)" : "translateX(0)",
                  transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </button>

          </div>
        </div>

        <nav className="px-5 pb-5 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-3 px-3 rounded-lg text-[20px] font-medium hover:bg-white/10"
            >
              {t(l.key)}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="py-3 px-3 rounded-lg text-[20px] font-medium hover:bg-white/10">My Dashboard</Link>
              <Link to="/list-property" onClick={() => setOpen(false)} className="mt-4 bg-gold-gradient text-[#0A1F5C] py-3.5 rounded-lg text-center font-bold">+ List Property</Link>
              <button
                type="button"
                onClick={async () => { await signOut(); setOpen(false); }}
                className="mt-2 bg-white/10 border border-white/30 text-white py-3.5 rounded-lg text-center font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="py-3 px-3 rounded-lg text-[20px] font-medium hover:bg-white/10">Sign In</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="mt-4 bg-gold-gradient text-[#0A1F5C] py-3.5 rounded-lg text-center font-bold">Create Account</Link>
            </>
          )}
          <a
            href={`tel:${PHONE}`}
            className="mt-2 bg-white/10 border border-white/30 text-white py-3.5 rounded-lg text-center font-bold flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> {PHONE}
          </a>
        </nav>
      </div>
    </header>
  );
}
