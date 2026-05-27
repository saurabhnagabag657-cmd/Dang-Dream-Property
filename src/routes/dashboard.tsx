import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Dang Dream Property" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, profile } = useAuth();

  return (
    <RequireAuth>
      <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
        <div className="container-luxe max-w-3xl">
          <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-primary">My Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    {profile?.full_name || profile?.username || user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <Link
                to="/list-property"
                className="rounded-2xl bg-gold-gradient text-primary p-5 font-bold shadow-gold hover:brightness-110 transition"
              >
                + List a Property
              </Link>
              <Link
                to="/properties"
                className="rounded-2xl bg-primary text-white p-5 font-bold shadow-luxe hover:bg-primary/90 transition"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

