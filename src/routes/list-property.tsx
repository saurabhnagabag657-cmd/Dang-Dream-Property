import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusCircle, Upload } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const Route = createFileRoute("/list-property")({
  head: () => ({ meta: [{ title: "List Property — Dang Dream Property" }] }),
  component: ListPropertyPage,
});

function ListPropertyPage() {
  const navigate = useNavigate();

  return (
    <RequireAuth>
      <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
        <div className="container-luxe max-w-3xl">
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-primary">List Your Property</h1>
                <p className="text-sm text-muted-foreground">
                  Add a new property listing to your account.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-pearl border border-border p-6">
              <div className="text-sm text-muted-foreground">
                Listing submission UI can be connected to your `user_properties` table next.
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate({ to: "/properties" })}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-3 text-sm font-bold hover:bg-primary/90 transition shadow-luxe"
                >
                  <Upload className="w-4 h-4" /> Go to Listings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

