import { Phone, MessageCircle } from "lucide-react";
import { PHONE } from "@/lib/data";

export function FloatingCTAs() {
  return (
    <div className="fixed bottom-4 inset-x-4 z-40 flex gap-3 lg:hidden">
      <a href={`tel:${PHONE}`} className="flex-1 bg-primary text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-luxe">
        <Phone className="w-4 h-4" /> Call Now
      </a>
      <a href={`https://wa.me/977${PHONE}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366] text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-luxe">
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
    </div>
  );
}
