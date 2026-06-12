import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ADDRESS, EMAIL, PHONES, RECEPTION, services } from "@/lib/data";
import { sendContactEmail } from "@/lib/email";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Dang Dream Property | Ghorahi, Dang" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { error: sendError } = await sendContactEmail({
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      propertyType: String(formData.get("propertyType") ?? "").trim(),
      budget: String(formData.get("budget") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    });

    if (sendError) {
      setError(sendError.message);
      setLoading(false);
      return;
    }

    e.currentTarget.reset();
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="pt-[100px] pb-20">
      <div className="bg-hero text-white py-16">
        <div className="container-luxe">
          <div className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Get in Touch</div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mt-2">We're Here to Help</h1>
          <p className="text-white/75 mt-4 max-w-2xl">Tell us what you need â€” our team responds within 24 hours.</p>
        </div>
      </div>

      <div className="container-luxe mt-14 grid lg:grid-cols-[1fr_1.3fr] gap-10">
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <div className="flex gap-3"><MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" /><div><div className="font-bold">Location</div><div className="text-sm text-muted-foreground mt-1">{ADDRESS}</div></div></div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <div className="flex gap-3"><Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Phone</div>
                {PHONES.map((p) => (
                  <div key={p}><a href={`tel:${p}`} className="text-sm hover:text-primary">{p}</a></div>
                ))}
                <div className="text-sm mt-1">Reception: <a href={`tel:${RECEPTION}`} className="hover:text-primary">{RECEPTION}</a></div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <div className="flex gap-3"><Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" /><div><div className="font-bold">Email</div><a href={`mailto:${EMAIL}`} className="text-sm break-all hover:text-primary">{EMAIL}</a></div></div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
            <div className="flex gap-3"><Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" /><div><div className="font-bold">Office Hours</div><div className="text-sm text-muted-foreground mt-1">Sundayâ€“Friday: 9:00 AM â€“ 6:00 PM<br/>Saturday: 10:00 AM â€“ 4:00 PM</div></div></div>
          </div>
          <iframe title="Map" className="w-full h-64 rounded-2xl border-0 shadow-card" src="https://www.google.com/maps?q=Ghorahi+Dang+Nepal&output=embed" />
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-card">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-display text-2xl font-bold mt-4">Thank you!</h3>
              <p className="text-muted-foreground mt-2">We'll contact you within 24 hours.</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-gold font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold">Send a Message</h2>
              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Field label="Full Name" required>
                  <input name="name" required className="input" />
                </Field>
                <Field label="Phone Number" required>
                  <input name="phone" required type="tel" defaultValue="+977 " className="input" />
                </Field>
                <Field label="Email Address">
                  <input name="email" type="email" className="input" />
                </Field>
                <Field label="Service Interested In" required>
                  <select name="service" required className="input">
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.id}>{s.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Property Type">
                  <select name="propertyType" className="input">
                    <option>House</option>
                    <option>Land</option>
                    <option>Apartment</option>
                    <option>Shop</option>
                    <option>Office</option>
                    <option>Farm</option>
                  </select>
                </Field>
                <Field label="Budget Range">
                  <select name="budget" className="input">
                    <option>Under 20 Lakh</option>
                    <option>20â€“50 Lakh</option>
                    <option>50Lâ€“1 Cr</option>
                    <option>1â€“3 Cr</option>
                    <option>Above 3 Cr</option>
                  </select>
                </Field>
              </div>
              <Field label="Your Message" required>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Tell us about your requirementsâ€¦"
                />
              </Field>
              <button
                disabled={loading}
                className="mt-6 w-full bg-gold-gradient text-primary font-semibold py-3.5 rounded-xl shadow-gold disabled:opacity-60"
              >
                {loading ? "Sending..." : "ðŸ“¤ Send Message"}
              </button>
            </>
          )}
        </form>
      </div>
      <style>{`.input{width:100%;background:var(--pearl);border-radius:.75rem;padding:.7rem .9rem;font-size:.9rem;outline:none;border:1px solid transparent} .input:focus{border-color:var(--gold)}`}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block mt-4 first:mt-0">
      <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
    </label>
  );
}
