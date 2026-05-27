import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EMICalculator } from "@/components/site/EMICalculator";

export const Route = createFileRoute("/tools")({
  head: () => ({ meta: [{ title: "EMI Calculator & Land Unit Converter | Dang Dream Property" }] }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="pt-[100px] pb-20">
      <div className="bg-hero text-white py-16">
        <div className="container-luxe">
          <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Smart Tools</div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mt-2">EMI Calculator & Land Unit Converter</h1>
          <p className="text-white/75 mt-4 max-w-2xl">Calculate home loan EMIs and convert Nepali land units in real time.</p>
        </div>
      </div>

      <div className="container-luxe mt-14 grid lg:grid-cols-2 gap-8">
        <EMICalculator />
        <LandConverter />
      </div>
    </div>
  );
}



function LandConverter() {
  const [hilly, setHilly] = useState({ r: 0, a: 1, p: 0, d: 0 });
  const [terai, setTerai] = useState({ b: 1, k: 0, dh: 0 });

  // Conversions (standard Nepali land units)
  const hillySqFt = hilly.r * 5476 + hilly.a * 342.25 + hilly.p * 85.5625 + hilly.d * 21.390625;
  const teraiSqFt = terai.b * 72900 + terai.k * 3645 + terai.dh * 182.25;

  return (
    <div className="bg-card rounded-3xl shadow-luxe border border-border p-7">
      <h2 className="font-display text-2xl font-bold">Nepali Land Unit Converter</h2>

      <div className="mt-6">
        <div className="text-xs font-bold uppercase tracking-wider text-gold">Terai System (Dang)</div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[["Bigha","b"],["Kattha","k"],["Dhur","dh"]].map(([l,k]) => (
            <label key={l} className="block">
              <span className="text-xs text-muted-foreground">{l}</span>
              <input type="number" value={(terai as any)[k]} onChange={(e) => setTerai({...terai, [k]: +e.target.value})} className="w-full bg-pearl rounded-lg px-3 py-2 text-sm outline-none mt-1" />
            </label>
          ))}
        </div>
        <Result sqft={teraiSqFt} />
      </div>

      <div className="mt-6">
        <div className="text-xs font-bold uppercase tracking-wider text-gold">Hilly System</div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[["Ropani","r"],["Aana","a"],["Paisa","p"],["Daam","d"]].map(([l,k]) => (
            <label key={l} className="block">
              <span className="text-xs text-muted-foreground">{l}</span>
              <input type="number" value={(hilly as any)[k]} onChange={(e) => setHilly({...hilly, [k]: +e.target.value})} className="w-full bg-pearl rounded-lg px-3 py-2 text-sm outline-none mt-1" />
            </label>
          ))}
        </div>
        <Result sqft={hillySqFt} />
      </div>

      <div className="mt-6 text-xs text-muted-foreground bg-pearl rounded-xl p-4 space-y-1">
        <div>• 1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq.ft</div>
        <div>• 1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5,476 sq.ft</div>
        <div>• 1 sq.m = 10.7639 sq.ft</div>
      </div>
    </div>
  );
}

function Result({ sqft }: { sqft: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-3">
      <div className="bg-primary text-white rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider text-gold">Sq. Feet</div><div className="font-display text-xl font-bold">{sqft.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div></div>
      <div className="bg-gold-gradient text-primary rounded-xl p-3"><div className="text-[10px] uppercase tracking-wider opacity-80">Sq. Meters</div><div className="font-display text-xl font-bold">{(sqft / 10.7639).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div></div>
    </div>
  );
}
