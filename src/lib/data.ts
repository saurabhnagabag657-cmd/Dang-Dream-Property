import houseDesignImg from "@/assets/house-design.jpg";
import houseGreyImg from "@/assets/699676492139465632.jpg";
import houseWhiteImg from "@/assets/723390758934520248.webp";
import ruralHouseImg from "@/assets/1 (1).webp";
import familyHouseImg from "@/assets/1 (2).webp";
import brickConstructionImg from "@/assets/1 (3).webp";
import commercialHouseImg from "@/assets/1 (4).webp";
import frontageHouseImg from "@/assets/1 (5).webp";
import villaHouseImg from "@/assets/Experience the captivating elegance of the….webp";
import heroMobileImg from "@/assets/Hero-image-for-mobile.jpg";
import heroPcImg from "@/assets/nepal_real_estate_hero.png";

export type Txn = "sale" | "rent" | "exchange";
export type Property = {
  id: string;
  name: string;
  type: string;
  txn: Txn;
  price: string;
  priceValue: number; // in lakh
  location: string;
  area: string;
  beds?: number;
  baths?: number;
  road: string;
  facing?: string;
  image: string;
  description: string;
  approvalStatus?: "draft" | "pending" | "approved" | "rejected";
  listingState?: "draft" | "pending" | "approved" | "rejected" | "available" | "sold" | "rented";
  featured?: boolean;
  ownerId?: string;
  city?: string;
  googleMapsUrl?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string | null;
  bedroomsCount?: number;
  bathroomsCount?: number;
  livingRoomsCount?: number;
  kitchensCount?: number;
  landArea?: string;
  builtUpArea?: string;
  amenities?: string[];
  imageUrls?: string[];
  imagePaths?: string[];
  viewsCount?: number;
  inquiriesCount?: number;
};

export const properties: Property[] = [
  {
    id: "p1",
    name: "Modern 3BHK House for Sale",
    type: "House",
    txn: "sale",
    price: "Rs. 65 Lakh",
    priceValue: 65,
    location: "Ghorahi-8, Dang",
    area: "1 Kattha",
    beds: 3, baths: 2, road: "16ft Road", facing: "East Facing",
    image: houseDesignImg,
    description: "Newly constructed modern house with quality finishing, 24hr water supply, covered parking for 2 vehicles. Prime location near main road.",
  },
  {
    id: "p2",
    name: "Prime Commercial Land",
    type: "Land",
    txn: "sale",
    price: "Rs. 12 Lakh / Kattha",
    priceValue: 48,
    location: "Tulsipur Road, Dang",
    area: "4 Kattha",
    road: "32ft Road", facing: "North Facing",
    image: heroMobileImg,
    description: "Prime commercial land on busy Tulsipur Road. Ideal for hotel, showroom, office building, or apartment.",
  },
  {
    id: "p3",
    name: "Affordable House for Rent",
    type: "House",
    txn: "rent",
    price: "Rs. 12,000 / month",
    priceValue: 0.12,
    location: "Lamahi, Dang",
    area: "Ground Floor",
    beds: 2, baths: 1, road: "13ft Road",
    image: familyHouseImg,
    description: "Comfortable 2BHK home with reliable water and electricity supply. Walking distance to Lamahi bazaar.",
  },
  {
    id: "p4",
    name: "Office Space — Ghorahi Center",
    type: "Office Space",
    txn: "rent",
    price: "Rs. 25,000 / month",
    priceValue: 0.25,
    location: "Ghorahi Bazaar, Dang",
    area: "800 sq.ft",
    road: "Main Road Facing",
    image: commercialHouseImg,
    description: "Bright 2nd floor office with parking and main road frontage. Perfect for finance, IT or consulting firms.",
  },
  {
    id: "p5",
    name: "Agricultural Farm Land",
    type: "Farm Land",
    txn: "sale",
    price: "Rs. 8 Lakh / Bigha",
    priceValue: 40,
    location: "Dang Valley",
    area: "5 Bigha",
    road: "Road Access",
    image: ruralHouseImg,
    description: "Fertile irrigation-ready agricultural land with motorable road access. Suitable for orchards or farming.",
  },
  {
    id: "p6",
    name: "Bungalow — New Settlement",
    type: "House",
    txn: "sale",
    price: "Rs. 1.2 Crore",
    priceValue: 120,
    location: "Ghorahi-15, Dang",
    area: "2.5 Kattha",
    beds: 4, baths: 3, road: "20ft Road", facing: "South Facing",
    image: villaHouseImg,
    description: "Premium bungalow with covered garage, garden and modern interior finishing in a quiet new settlement.",
  },
  {
    id: "p7",
    name: "Shop Space — Dang Bazaar",
    type: "Shop Space",
    txn: "rent",
    price: "Rs. 15,000 / month",
    priceValue: 0.15,
    location: "Dang Bazaar Main Road",
    area: "400 sq.ft",
    road: "Corner Location",
    image: frontageHouseImg,
    description: "Ground-floor corner shop with high foot traffic. Ready to move in.",
  },
  {
    id: "p8",
    name: "Plotting Land — New Colony",
    type: "Land",
    txn: "sale",
    price: "Rs. 6 Lakh / Kattha",
    priceValue: 30,
    location: "Ghorahi Outskirts, Dang",
    area: "1–5 Kattha",
    road: "13ft Road", facing: "East Facing",
    image: brickConstructionImg,
    description: "Residential plotting in a planned new colony. Water pipeline and electricity coming soon.",
  },
];

export const categories = [
  { key: "House", icon: "Home", count: "120+ Listed" },
  { key: "Land", icon: "TreePine", count: "80+ Listed" },
  { key: "Apartment", icon: "Building2", count: "45+ Listed" },
  { key: "Shop Space", icon: "Store", count: "30+ Listed" },
  { key: "Office Space", icon: "Briefcase", count: "25+ Listed" },
  { key: "Farm Land", icon: "Sprout", count: "60+ Listed" },
];

export const services = [
  { id: "buy", name: "Buy Property", icon: "Home", desc: "Verified listings across Dang with end-to-end buying support." },
  { id: "sell", name: "Sell Property", icon: "TrendingUp", desc: "Maximize your sale price with our marketing network." },
  { id: "exchange", name: "Property Exchange", icon: "Repeat", desc: "Hassle-free jagga saata (land/house exchange) facilitation." },
  { id: "finance", name: "Bank Finance Facility", icon: "Landmark", desc: "Coordinated home loan support with partner banks." },
  { id: "rent", name: "Rent / Rental Service", icon: "Key", desc: "Find tenants or rental homes — fully managed." },
  { id: "design3d", name: "3D Property & House Design", icon: "Box", desc: "Visualize your dream home in 3D before building." },
  { id: "construction", name: "Building Construction", icon: "HardHat", desc: "Turnkey construction with quality assurance." },
  { id: "interior", name: "Interior Design", icon: "Sofa", desc: "Premium interior styling tailored to your taste." },
  { id: "insurance", name: "Insurance Facility", icon: "ShieldCheck", desc: "Property and home insurance support." },
  { id: "renovation", name: "Renovation Service", icon: "Hammer", desc: "Modernize and upgrade existing properties." },
  { id: "naksa", name: "Naksa / Blueprint Service", icon: "Ruler", desc: "Municipality-approved blueprints and naksa pass." },
];

export const locations = [
  { name: "Ghorahi City Center", count: "80+ Properties", image: houseWhiteImg },
  { name: "Tulsipur Road", count: "45+ Properties", image: heroPcImg },
  { name: "Lamahi Bazaar", count: "30+ Properties", image: heroMobileImg },
  { name: "Dang Bazaar", count: "25+ Properties", image: commercialHouseImg },
  { name: "Salyan Road Area", count: "20+ Properties", image: ruralHouseImg },
  { name: "New Settlement Areas", count: "50+ Properties", image: houseGreyImg },
];

export const testimonials = [
  { name: "Ram Prasad Thapa", role: "Buyer", loc: "Ghorahi, Dang", text: "Dang Dream Property helped me find my dream home in Ghorahi within 2 weeks. Their team was professional, transparent, and always available. Highly recommend!" },
  { name: "Sita Paudel", role: "Seller", loc: "Tulsipur, Dang", text: "I sold my commercial property at the best price thanks to Dang Dream Property's strong network. Truly the best in Dang!" },
  { name: "Bikram BK", role: "Buyer", loc: "Lamahi, Dang", text: "Their bank finance service made it so easy for me to get a home loan. Everything was handled for me." },
  { name: "Kamala Shrestha", role: "Construction Client", loc: "Ghorahi, Dang", text: "The 3D house design service is amazing. I could see my house before it was even built!" },
  { name: "Dev Raj Oli", role: "Investor", loc: "Dang Bazaar", text: "Very honest and reliable team. They found us a great commercial plot in Dang Bazaar." },
  { name: "Mina Karki", role: "Landlord", loc: "Ghorahi, Dang", text: "As a landlord, Dang Dream Property manages my rental property perfectly. Zero hassle!" },
];

export const faqs = [
  { q: "How do I buy a property through Dang Dream Property?", a: "Browse our verified listings, shortlist with our advisors, do a site visit, and we handle documentation, negotiation, and registration end-to-end." },
  { q: "Can you help me get a bank loan for my property?", a: "Yes. We partner with leading banks in Nepal and coordinate paperwork, valuation and disbursement on your behalf." },
  { q: "Do you offer 3D house design services?", a: "Absolutely — our in-house design team creates photo-realistic 3D models of your future home before construction begins." },
  { q: "How long does a property transaction take?", a: "Most house transactions complete in 3–6 weeks depending on financing and ward-office processing." },
  { q: "Do you handle property exchange (jagga saata)?", a: "Yes, we structure valuation-balanced exchanges between owners with full legal compliance." },
  { q: "What areas of Dang do you cover?", a: "Ghorahi, Tulsipur, Lamahi, Dang Bazaar, Salyan Road and all surrounding settlements." },
  { q: "Can foreigners / NRN buy property through you?", a: "NRN buyers are supported under Nepal's NRN Act framework — we guide you through compliance." },
  { q: "How much is your commission for selling a property?", a: "Transparent commission discussed upfront — typically a small percentage of final sale price." },
  { q: "Do you offer construction and renovation services?", a: "Yes — full turnkey construction, renovation and interior design under one roof." },
  { q: "How do I list my property for sale or rent?", a: "Click 'List Your Property' in the navbar or call 9866970444 — our team will visit and verify within 48 hours." },
];

export const news = [
  { date: "12 Mar 2025", category: "Market Update", title: "Dang Real Estate Market Sees 30% Growth in 2024", excerpt: "Dang is emerging as one of Nepal's hottest real estate destinations driven by infrastructure and migration trends." },
  { date: "28 Feb 2025", category: "Finance", title: "New Bank Finance Schemes Available for Home Buyers", excerpt: "Several banks have launched competitive home loan schemes specifically tailored for Lumbini-Karnali region buyers." },
  { date: "10 Feb 2025", category: "Construction", title: "3D House Design: The Future of Home Building in Nepal", excerpt: "Modern visualization technology is transforming how Nepali families plan and approve their dream homes." },
  { date: "20 Jan 2025", category: "Market Update", title: "Commercial Property Demand Rising Along Tulsipur Road", excerpt: "Entrepreneurs and chains are eyeing Tulsipur Road for shops, showrooms and office spaces." },
];

export const PHONE = "9866970444";
export const PHONES = ["9866970444", "9707622512", "9761239780"];
export const RECEPTION = "9761281983";
export const EMAIL = "dangdreamproperty@gmail.com";
export const ADDRESS = "Ghorahi-15, Tulsipur Road, Near DK Petrol Pump, Dang, Nepal";
