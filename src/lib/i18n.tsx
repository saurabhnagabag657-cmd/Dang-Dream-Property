import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ne";

type Dict = Record<string, { en: string; ne: string }>;

export const dict: Dict = {
  nav_home: { en: "Home", ne: "गृहपृष्ठ" },
  nav_properties: { en: "Properties", ne: "सम्पत्तिहरू" },
  nav_services: { en: "Services", ne: "सेवाहरू" },
  nav_about: { en: "About Us", ne: "हाम्रो बारेमा" },
  nav_tools: { en: "Tools", ne: "उपकरणहरू" },
  nav_news: { en: "News", ne: "समाचार" },
  nav_contact: { en: "Contact", ne: "सम्पर्क" },
  cta_list: { en: "List Your Property", ne: "सम्पत्ति सूचीकृत गर्नुहोस्" },
  hero_badge: { en: "Dang's #1 Trusted Real Estate Company", ne: "दाङको #१ विश्वसनीय रियल इस्टेट कम्पनी" },
  hero_title_1: { en: "Find Your Dream", ne: "तपाईंको सपनाको" },
  hero_title_2: { en: "Property in Dang", ne: "सम्पत्ति दाङमा खोज्नुहोस्" },
  hero_sub: {
    en: "Nepal's fastest growing region — premium houses, land, apartments, commercial properties & complete real estate services.",
    ne: "नेपालको सबैभन्दा छिटो बढ्दो क्षेत्र — प्रिमियम घर, जग्गा, अपार्टमेन्ट, व्यावसायिक सम्पत्ति र पूर्ण रियल इस्टेट सेवाहरू।",
  },
  cta_explore: { en: "Explore Properties", ne: "सम्पत्तिहरू हेर्नुहोस्" },
  cta_services: { en: "Our Services", ne: "हाम्रा सेवाहरू" },
  tab_buy: { en: "Buy", ne: "किन्ने" },
  tab_rent: { en: "Rent", ne: "भाडामा" },
  tab_exchange: { en: "Exchange", ne: "साटो" },
  tab_finance: { en: "Finance", ne: "वित्त" },
  search_location: { en: "Enter city, area or project", ne: "स्थान, क्षेत्र वा परियोजना" },
  search_type: { en: "Property Type", ne: "सम्पत्तिको प्रकार" },
  search_budget: { en: "Budget", ne: "बजेट" },
  btn_search: { en: "Search", ne: "खोज्नुहोस्" },
  stat_properties: { en: "Properties", ne: "सम्पत्तिहरू" },
  stat_clients: { en: "Happy Clients", ne: "खुसी ग्राहकहरू" },
  stat_locations: { en: "Locations", ne: "स्थानहरू" },
  stat_satisfaction: { en: "Client Satisfaction", ne: "ग्राहक सन्तुष्टि" },
  section_browse: { en: "Browse by Property Type", ne: "सम्पत्तिको प्रकार अनुसार हेर्नुहोस्" },
  section_browse_sub: { en: "Find exactly what you're looking for", ne: "ठ्याक्कै के खोज्दै हुनुहुन्छ त्यो भेट्टाउनुहोस्" },
  section_featured: { en: "Featured Properties", ne: "विशेष सम्पत्तिहरू" },
  section_featured_sub: { en: "Hand-picked premium listings in Dang's best locations", ne: "दाङका उत्कृष्ट स्थानहरूमा छानिएका प्रिमियम सूचीहरू" },
  view_all: { en: "View All Properties", ne: "सबै हेर्नुहोस्" },
  view_details: { en: "View Details", ne: "विवरण हेर्नुहोस्" },
  section_services: { en: "Our Complete Real Estate Services", ne: "हाम्रा पूर्ण रियल इस्टेट सेवाहरू" },
  section_services_sub: { en: "Everything you need — under one roof", ne: "तपाईंलाई चाहिने सबै कुरा — एकै ठाउँमा" },
  section_why: { en: "Why Dang Chooses Us", ne: "दाङले हामीलाई किन रोज्छ" },
  section_locations: { en: "Explore Properties by Location", ne: "स्थान अनुसार सम्पत्तिहरू" },
  section_testimonials: { en: "What Our Clients Say", ne: "हाम्रा ग्राहकहरू के भन्छन्" },
  section_news: { en: "News & Real Estate Updates", ne: "समाचार र रियल इस्टेट अपडेट" },
  section_faq: { en: "Frequently Asked Questions", ne: "बारम्बार सोधिने प्रश्नहरू" },
  section_contact: { en: "Get In Touch", ne: "सम्पर्कमा रहनुहोस्" },
  section_budget: { en: "Properties by Budget", ne: "बजेट अनुसार सम्पत्तिहरू" },
  ceo_title: { en: "A Message from Our CEO", ne: "हाम्रा सीईओको सन्देश" },
  tagline: { en: "Your Dream Property, Our Promise", ne: "तपाईंको सपनाको सम्पत्ति, हाम्रो वाचा" },
  call_now: { en: "Call Now", ne: "फोन गर्नुहोस्" },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k]?.en ?? String(k),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? dict[k]?.en ?? String(k);
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
