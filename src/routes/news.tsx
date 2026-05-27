import { createFileRoute } from "@tanstack/react-router";
import { news } from "@/lib/data";
import heroMobileImg from "@/assets/Hero-image-for-mobile.jpg";
import heroPcImg from "@/assets/nepal_real_estate_hero.png";
import commercialHouseImg from "@/assets/1 (4).webp";
import villaHouseImg from "@/assets/Experience the captivating elegance of the….webp";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "Dang Real Estate News & Insights | Dang Dream Property" }] }),
  component: NewsPage,
});

const IMGS = [heroMobileImg, commercialHouseImg, villaHouseImg, heroPcImg];

function NewsPage() {
  return (
    <div className="pt-[100px] pb-20">
      <div className="bg-hero text-white py-16">
        <div className="container-luxe">
          <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Insights</div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mt-2">News & Real Estate Updates</h1>
          <p className="text-white/75 mt-4 max-w-2xl">Stay informed about Dang's evolving property market, new financing options, and construction trends.</p>
        </div>
      </div>

      <div className="container-luxe mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((n, i) => (
          <article key={n.title} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:shadow-luxe transition">
            <img src={IMGS[i % IMGS.length]} loading="lazy" className="h-52 w-full object-cover" alt="" />
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-gold text-primary font-bold px-2 py-0.5 rounded uppercase">{n.category}</span>
                <span className="text-muted-foreground">{n.date}</span>
              </div>
              <h2 className="font-display font-bold text-xl mt-3 leading-snug">{n.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{n.excerpt}</p>
              <button className="mt-4 text-sm font-semibold text-gold">Read More →</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
