import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Eye,
  FileClock,
  LayoutDashboard,
  LogOut,
  PencilLine,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  MessageSquareText,
  ArrowUpRight,
  CircleCheckBig,
  CircleX,
  Clock3,
} from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
// property-listings.client is dynamically imported where needed to avoid server import protection
import type { Property } from "@/lib/data";
import { listingBadgeLabel } from "@/lib/listings";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Dang Dream Property" }] }),
  component: DashboardPage,
});

type InquiryRow = {
  id: string;
  property_id: string;
  property_title: string;
  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  role: string;
  message: string;
  created_at: string;
};

function DashboardPage() {
  const { user, profile } = useAuth();
  const isAdmin = (profile?.status || "").toLowerCase() === "admin";

  const [listings, setListings] = useState<Property[]>([]);
  const [adminListings, setAdminListings] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const myListings = useMemo(() => listings, [listings]);
  const drafts = useMemo(() => myListings.filter((item) => item.approvalStatus === "draft"), [myListings]);
  const pending = useMemo(() => myListings.filter((item) => item.approvalStatus === "pending"), [myListings]);
  const published = useMemo(
    () => myListings.filter((item) => item.approvalStatus === "approved" && item.listingState !== "draft"),
    [myListings],
  );

  const load = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const m = await import(`@/lib/${"property-listings.client"}`);
      const [mine, adminRows] = await Promise.all([
        m.fetchMyListings(user.id),
        isAdmin ? m.fetchAdminListings() : Promise.resolve([] as Property[]),
      ]);
      setListings(mine);
      setAdminListings(adminRows);

      const inquiryQuery = supabase
        .from("property_inquiries")
        .select("id, property_id, property_title, sender_name, sender_phone, sender_email, role, message, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      const { data: inquiryRows, error: inquiryError } = isAdmin
        ? await inquiryQuery
        : await supabase
            .from("property_inquiries")
            .select("id, property_id, property_title, sender_name, sender_phone, sender_email, role, message, created_at")
            .eq("property_owner_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

      if (inquiryError) throw inquiryError;
      setInquiries((inquiryRows ?? []) as InquiryRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isAdmin]);

  const refresh = async () => {
    await load();
  };

  const runAction = async (key: string, fn: () => Promise<void>) => {
    setActionLoading(key);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <RequireAuth>
      <div className="pt-[100px] pb-20 min-h-screen bg-pearl">
        <div className="container-luxe max-w-7xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-primary">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name || profile?.username || user?.email} · Manage your listings and inquiries.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/list-property"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <PlusCircle className="w-4 h-4" /> New Listing
              </Link>
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-10 flex h-60 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="My Listings" value={myListings.length} icon={<BadgeCheck className="w-5 h-5" />} />
                <StatCard title="Drafts" value={drafts.length} icon={<FileClock className="w-5 h-5" />} />
                <StatCard title="Pending Approval" value={pending.length} icon={<Clock3 className="w-5 h-5" />} />
                <StatCard title="Published" value={published.length} icon={<Sparkles className="w-5 h-5" />} />
              </div>

              <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                <section className="space-y-6">
                  <Panel title="My Listings" icon={<User className="w-4 h-4" />}>
                    <div className="grid gap-4">
                      {myListings.length === 0 ? (
                        <EmptyState title="No listings yet" copy="Create your first property listing to start collecting views and inquiries." />
                      ) : (
                        myListings.map((item) => <ListingRow key={item.id} item={item} actionLoading={actionLoading} onAction={runAction} />)
                      )}
                    </div>
                  </Panel>

                  <Panel title="Inquiries" icon={<MessageSquareText className="w-4 h-4" />}>
                    <div className="grid gap-3">
                      {inquiries.length === 0 ? (
                        <EmptyState title="No inquiries yet" copy="Once people start reaching out, their messages will appear here." />
                      ) : (
                        inquiries.map((inq) => (
                          <div key={inq.id} className="rounded-2xl border border-border bg-pearl p-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                <div className="font-semibold text-sm">{inq.sender_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {inq.role} · {inq.property_title || "Property"}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">{new Date(inq.created_at).toLocaleString()}</div>
                            </div>
                            <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{inq.message}</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span>{inq.sender_phone}</span>
                              {inq.sender_email && <span>{inq.sender_email}</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Panel>
                </section>

                <aside className="space-y-6">
                  <Panel title="Quick Links" icon={<ArrowUpRight className="w-4 h-4" />}>
                    <div className="grid gap-3">
                      <Link to="/list-property" className="rounded-2xl bg-primary text-white px-4 py-3 text-sm font-semibold hover:bg-primary/90 inline-flex items-center justify-center gap-2">
                        <PlusCircle className="w-4 h-4" /> Create Listing
                      </Link>
                      <Link to="/properties" className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50 inline-flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" /> View Public Listings
                      </Link>
                    </div>
                  </Panel>

                  {isAdmin && (
                    <Panel title="Approval Queue" icon={<ShieldCheck className="w-4 h-4" />}>
                      <div className="grid gap-4">
                        {adminListings.filter((item) => item.approvalStatus !== "approved").length === 0 ? (
                          <EmptyState title="No items waiting" copy="Everything in the queue has already been handled." />
                        ) : (
                          adminListings
                            .filter((item) => item.approvalStatus !== "approved")
                            .map((item) => (
                              <div key={item.id} className="rounded-2xl border border-border bg-pearl p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="font-semibold text-sm">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.location}</div>
                                  </div>
                                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{item.approvalStatus}</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <ActionButton
                                    label="Approve"
                                    icon={<CircleCheckBig className="w-4 h-4" />}
                                    busy={actionLoading === `approve-${item.id}`}
                                    onClick={() =>
                                      runAction(`approve-${item.id}`, async () => {
                                        const m = await import(`@/lib/${"property-listings.client"}`);
                                        await m.updateApprovalStatus({
                                          id: item.id.slice(2),
                                          approvalStatus: "approved",
                                          listingState: "available",
                                        });
                                      })
                                    }
                                  />
                                  <ActionButton
                                    label="Reject"
                                    icon={<CircleX className="w-4 h-4" />}
                                    busy={actionLoading === `reject-${item.id}`}
                                    onClick={() =>
                                      runAction(`reject-${item.id}`, async () => {
                                        const reason = window.prompt("Reject reason (optional):") ?? "";
                                        const m = await import(`@/lib/${"property-listings.client"}`);
                                        await m.updateApprovalStatus({
                                          id: item.id.slice(2),
                                          approvalStatus: "rejected",
                                          listingState: "rejected",
                                          rejectedReason: reason || null,
                                        });
                                      })
                                    }
                                  />
                                  <ActionButton
                                    label={item.featured ? "Unfeature" : "Feature"}
                                    icon={<Sparkles className="w-4 h-4" />}
                                    busy={actionLoading === `feature-${item.id}`}
                                    onClick={() =>
                                      runAction(`feature-${item.id}`, async () => {
                                        const m = await import(`@/lib/${"property-listings.client"}`);
                                        await m.updateApprovalStatus({
                                          id: item.id.slice(2),
                                          approvalStatus: item.approvalStatus || "approved",
                                          featured: !item.featured,
                                        });
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </Panel>
                  )}
                </aside>
              </div>
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
          <div className="mt-2 font-display text-3xl font-bold text-primary">{value}</div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">{icon}</div>
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card shadow-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="text-gold">{icon}</span>
        <h2 className="font-display text-2xl font-bold text-primary">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-pearl p-6 text-center">
      <div className="font-semibold text-foreground">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  busy,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  busy?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold hover:bg-gray-50 disabled:opacity-60"
    >
      {icon}
      {busy ? "Working..." : label}
    </button>
  );
}

function ListingRow({
  item,
  actionLoading,
  onAction,
}: {
  item: Property;
  actionLoading: string | null;
  onAction: (key: string, fn: () => Promise<void>) => Promise<void>;
}) {
  const id = item.id;
  const editableId = id.startsWith("u-") ? id.slice(2) : id;
  const statusLabel = listingBadgeLabel(item.listingState);

  return (
    <div className="rounded-2xl border border-border bg-pearl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-28 w-full overflow-hidden rounded-2xl border border-border lg:h-24 lg:w-36">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-display text-xl font-bold text-primary">{item.name}</div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              {item.approvalStatus}
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              {statusLabel}
            </span>
            {item.featured && <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Featured</span>}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{item.location}</div>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>{item.price}</span>
            <span>{item.viewsCount ?? 0} views</span>
            <span>{item.inquiriesCount ?? 0} inquiries</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Link
            to="/list-property"
            search={{ edit: editableId } as any}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold hover:bg-gray-50"
          >
            <PencilLine className="w-4 h-4" /> Edit
          </Link>
          <ActionButton
            label="Available"
            icon={<BadgeCheck className="w-4 h-4" />}
            busy={actionLoading === `available-${id}`}
            onClick={() => onAction(`available-${id}`, async () => {
              const m = await import(`@/lib/${"property-listings.client"}`);
              await m.updatePropertyState(editableId, "available");
            })}
          />
          <ActionButton
            label="Sold"
            icon={<CircleCheckBig className="w-4 h-4" />}
            busy={actionLoading === `sold-${id}`}
            onClick={() => onAction(`sold-${id}`, async () => {
              const m = await import(`@/lib/${"property-listings.client"}`);
              await m.updatePropertyState(editableId, "sold");
            })}
          />
          <ActionButton
            label="Rented"
            icon={<Clock3 className="w-4 h-4" />}
            busy={actionLoading === `rented-${id}`}
            onClick={() => onAction(`rented-${id}`, async () => {
              const m = await import(`@/lib/${"property-listings.client"}`);
              await m.updatePropertyState(editableId, "rented");
            })}
          />
          <ActionButton
            label="Delete"
            icon={<Trash2 className="w-4 h-4" />}
            busy={actionLoading === `delete-${id}`}
            onClick={() => onAction(`delete-${id}`, async () => {
              const m = await import("@/lib/property-listings.client");
              await m.deletePropertyListing(editableId);
            })}
          />
        </div>
      </div>
    </div>
  );
}

async function updateState(id: string, state: "available" | "sold" | "rented") {
  const m = await import(`@/lib/${"property-listings.client"}`);
  await m.updatePropertyState(id, state);
}
