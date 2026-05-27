import { useMemo, useState } from "react";
import { Calculator, IndianRupee } from "lucide-react";

type EMICalculatorProps = {
  defaultAmount?: number;
};

export function EMICalculator({ defaultAmount = 5000000 }: EMICalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const principal = Math.max(0, amount);
    const months = Math.max(1, years * 12);
    const monthlyRate = Math.max(0, rate) / 12 / 100;

    if (monthlyRate === 0) {
      const emi = principal / months;
      return { emi, total: principal, interest: 0 };
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const emi = (principal * monthlyRate * factor) / (factor - 1);
    const total = emi * months;

    return { emi, total, interest: total - principal };
  }, [amount, rate, years]);

  const money = (value: number) =>
    `Rs. ${Math.round(value).toLocaleString("en-IN")}`;

  return (
    <div className="bg-card rounded-3xl shadow-luxe border border-border p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.18em] uppercase text-gold">
            Home Finance
          </div>
          <h2 className="font-display text-2xl font-bold mt-1">EMI Calculator</h2>
        </div>
        <div className="w-11 h-11 rounded-xl bg-gold-gradient text-primary flex items-center justify-center shadow-gold">
          <Calculator className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <NumberField
          label="Loan Amount"
          value={amount}
          min={100000}
          step={100000}
          onChange={setAmount}
        />
        <NumberField
          label="Interest Rate (%)"
          value={rate}
          min={1}
          step={0.1}
          onChange={setRate}
        />
        <NumberField
          label="Loan Tenure (Years)"
          value={years}
          min={1}
          step={1}
          onChange={setYears}
        />
      </div>

      <div className="mt-7 grid sm:grid-cols-3 gap-3">
        <ResultCard label="Monthly EMI" value={money(result.emi)} featured />
        <ResultCard label="Total Interest" value={money(result.interest)} />
        <ResultCard label="Total Payment" value={money(result.total)} />
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-2 flex items-center gap-2 bg-pearl rounded-xl px-3 py-2.5">
        <IndianRupee className="w-4 h-4 text-gold shrink-0" />
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
          className="w-full bg-transparent outline-none text-sm font-semibold"
        />
      </div>
    </label>
  );
}

function ResultCard({
  label,
  value,
  featured = false,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        featured ? "bg-primary text-white" : "bg-pearl text-foreground"
      }`}
    >
      <div
        className={`text-[10px] uppercase tracking-wider font-bold ${
          featured ? "text-gold" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
      <div className="font-display text-lg font-bold mt-1 break-words">{value}</div>
    </div>
  );
}
