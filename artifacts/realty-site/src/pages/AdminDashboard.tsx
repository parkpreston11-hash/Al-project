import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  useGetAdminStats, useGetAdminLeads, useGetAdminLeadById,
  useUpdateAdminLead, getGetAdminLeadsQueryKey, getGetAdminStatsQueryKey, getGetAdminLeadByIdQueryKey,
  setAuthTokenGetter,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Users, TrendingUp, UserCheck, Calendar,
  Search, LogOut, Home as HomeIcon, X, Phone, Mail,
  ChevronRight, Inbox, Building2, Plus, Pencil, Trash2,
  CheckCircle, ToggleLeft, ToggleRight, AlertTriangle, Image
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface AdminListing {
  id: number;
  status: "active" | "sold";
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  shortDescription: string;
  soldDescription: string | null;
  imageUrl: string;
  images: string[];
  features: string[];
  soldDate: string | null;
  createdAt: string;
}

// ── Listing form schema ────────────────────────────────────────────────────
const listingSchema = z.object({
  status: z.enum(["active", "sold"]),
  price: z.coerce.number().int().positive("Price must be a positive number"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP is required"),
  beds: z.coerce.number().int().positive("Beds must be a positive number"),
  baths: z.coerce.number().positive("Baths must be a positive number"),
  sqft: z.coerce.number().int().positive("Sqft must be a positive number"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional().default(""),
  soldDescription: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  imagesRaw: z.string().optional(),
  featuresRaw: z.string().optional(),
  soldDate: z.string().optional(),
});
type ListingFormValues = z.infer<typeof listingSchema>;

// ── Lead constants ─────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  new: "New Lead", contacted: "Contacted",
  appointment_scheduled: "Appointment Scheduled",
  active_client: "Active Client", closed: "Closed",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800", contacted: "bg-yellow-100 text-yellow-800",
  appointment_scheduled: "bg-purple-100 text-purple-800",
  active_client: "bg-green-100 text-green-800", closed: "bg-gray-100 text-gray-600",
};
const TYPE_LABELS: Record<string, string> = { contact: "Contact", seller: "Seller", buyer_plan: "Buyer" };
const TYPE_COLORS: Record<string, string> = {
  contact: "bg-amber-100 text-amber-800",
  seller: "bg-primary/10 text-primary",
  buyer_plan: "bg-green-100 text-green-800",
};
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// ── Admin API helpers ──────────────────────────────────────────────────────
function adminFetch(url: string, options?: RequestInit) {
  const token = localStorage.getItem("admin_token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [mainTab, setMainTab] = useState<"leads" | "properties">("leads");

  // ── Leads state ──
  const [activeLeadTab, setActiveLeadTab] = useState<"all" | "contact" | "seller" | "buyer_plan">("all");
  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  // ── Properties state ──
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<"all" | "active" | "sold">("all");
  const [showListingForm, setShowListingForm] = useState(false);
  const [editingListing, setEditingListing] = useState<AdminListing | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteLeadConfirmId, setDeleteLeadConfirmId] = useState<number | null>(null);
  const [deleteLeadLoading, setDeleteLeadLoading] = useState(false);

  const token = localStorage.getItem("admin_token");
  useEffect(() => {
    if (!token) { setLocation("/admin"); return; }
    setAuthTokenGetter(() => token);
  }, [token, setLocation]);

  // ── Lead queries ──
  const stats = useGetAdminStats({ query: { enabled: !!token, queryKey: getGetAdminStatsQueryKey() } });
  const leads = useGetAdminLeads(
    { type: activeLeadTab, search: search || undefined },
    { query: { enabled: !!token, queryKey: getGetAdminLeadsQueryKey({ type: activeLeadTab, search: search || undefined }) } }
  );
  const selectedLead = useGetAdminLeadById(
    selectedLeadId ?? 0,
    { query: { enabled: !!selectedLeadId, queryKey: getGetAdminLeadByIdQueryKey(selectedLeadId ?? 0) } }
  );
  const updateLead = useUpdateAdminLead();

  useEffect(() => {
    if (selectedLead.data) {
      setNotes(selectedLead.data.notes ?? "");
      setSelectedStatus(selectedLead.data.status);
      setNotesSaved(false);
    }
  }, [selectedLead.data]);

  // ── Load listings ──
  const loadListings = useCallback(async () => {
    if (!token) return;
    setListingsLoading(true);
    setListingsError(null);
    try {
      const res = await adminFetch("/api/admin/listings");
      if (res.ok) {
        setListings(await res.json());
      } else {
        const body = await res.json().catch(() => ({}));
        setListingsError(body?.error ?? `Server error ${res.status} — check that DATABASE_URL is set in your deployment environment.`);
      }
    } catch {
      setListingsError("Could not reach the API. Check your internet connection or deployment configuration.");
    } finally {
      setListingsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (mainTab === "properties") loadListings();
  }, [mainTab, loadListings]);

  // ── Listing form ──
  const listingForm = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      status: "active", price: 0, address: "", city: "", state: "CA", zip: "",
      beds: 3, baths: 2, sqft: 0, description: "", shortDescription: "",
      soldDescription: "", imageUrl: "", imagesRaw: "", featuresRaw: "", soldDate: "",
    },
  });

  function openAddListing() {
    setEditingListing(null);
    listingForm.reset({
      status: "active", price: 0, address: "", city: "", state: "CA", zip: "",
      beds: 3, baths: 2, sqft: 0, description: "", shortDescription: "",
      soldDescription: "", imageUrl: "", imagesRaw: "", featuresRaw: "", soldDate: "",
    });
    setShowListingForm(true);
  }

  function openEditListing(listing: AdminListing) {
    setEditingListing(listing);
    listingForm.reset({
      status: listing.status,
      price: listing.price,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zip: listing.zip,
      beds: listing.beds,
      baths: listing.baths,
      sqft: listing.sqft,
      description: listing.description,
      shortDescription: listing.shortDescription,
      soldDescription: listing.soldDescription ?? "",
      imageUrl: listing.imageUrl,
      imagesRaw: listing.images.join("\n"),
      featuresRaw: listing.features.join("\n"),
      soldDate: listing.soldDate ?? "",
    });
    setShowListingForm(true);
  }

  async function onListingSubmit(values: ListingFormValues) {
    setFormSaving(true);
    const payload = {
      status: values.status,
      price: values.price,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      beds: values.beds,
      baths: values.baths,
      sqft: values.sqft,
      description: values.description,
      shortDescription: values.shortDescription,
      soldDescription: values.soldDescription || null,
      imageUrl: values.imageUrl,
      images: (values.imagesRaw ?? "").split("\n").map(s => s.trim()).filter(Boolean),
      features: (values.featuresRaw ?? "").split("\n").map(s => s.trim()).filter(Boolean),
      soldDate: values.soldDate || null,
    };
    try {
      let res: Response;
      if (editingListing) {
        res = await adminFetch(`/api/admin/listings/${editingListing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch("/api/admin/listings", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        setShowListingForm(false);
        loadListings();
        // Invalidate public listing caches too
        queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).includes("listing") });
      }
    } finally {
      setFormSaving(false);
    }
  }

  async function toggleStatus(listing: AdminListing) {
    const newStatus = listing.status === "active" ? "sold" : "active";
    const payload: Record<string, unknown> = { status: newStatus };
    if (newStatus === "sold" && !listing.soldDate) {
      payload.soldDate = new Date().toISOString().split("T")[0];
    }
    if (newStatus === "active") {
      payload.soldDate = null;
    }
    await adminFetch(`/api/admin/listings/${listing.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    loadListings();
    queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).includes("listing") });
  }

  async function deleteLead(id: number) {
    setDeleteLeadLoading(true);
    try {
      await adminFetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      setDeleteLeadConfirmId(null);
      setSelectedLeadId(null);
      queryClient.invalidateQueries({ queryKey: getGetAdminLeadsQueryKey({ type: activeLeadTab, search: search || undefined }) });
      queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
    } finally {
      setDeleteLeadLoading(false);
    }
  }

  async function deleteListing(id: number) {
    setDeleteLoading(true);
    try {
      await adminFetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      loadListings();
      queryClient.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).includes("listing") });
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setAuthTokenGetter(null);
    setLocation("/admin");
  }

  function handleLeadStatusChange(status: string) {
    setSelectedStatus(status);
    setNotesSaved(false);
    if (!selectedLeadId) return;
    updateLead.mutate(
      { id: selectedLeadId, data: { status: status as "new" | "contacted" | "appointment_scheduled" | "active_client" | "closed" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadsQueryKey({ type: activeLeadTab, search: search || undefined }) });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadByIdQueryKey(selectedLeadId) });
        }
      }
    );
  }

  function handleSaveNotes() {
    if (!selectedLeadId) return;
    updateLead.mutate(
      { id: selectedLeadId, data: { notes, status: selectedStatus as "new" | "contacted" | "appointment_scheduled" | "active_client" | "closed" } },
      {
        onSuccess: () => {
          setNotesSaved(true);
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadsQueryKey({ type: activeLeadTab, search: search || undefined }) });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadByIdQueryKey(selectedLeadId) });
        }
      }
    );
  }

  if (!token) return null;

  const filteredListings = propertyFilter === "all"
    ? listings
    : listings.filter(l => l.status === propertyFilter);

  const leadData = selectedLead.data?.data as Record<string, string> | undefined;
  const statCards = [
    { label: "Total Leads", value: stats.data?.total ?? "—", icon: <Users size={20} className="text-accent" /> },
    { label: "New This Week", value: stats.data?.newThisWeek ?? "—", icon: <TrendingUp size={20} className="text-accent" /> },
    { label: "Active Clients", value: stats.data?.byStatus?.active_client ?? "—", icon: <UserCheck size={20} className="text-accent" /> },
    { label: "Appointments", value: stats.data?.byStatus?.appointment_scheduled ?? "—", icon: <Calendar size={20} className="text-accent" /> },
  ];
  const leadTabs = [
    { key: "all" as const, label: "All", count: stats.data?.total },
    { key: "buyer_plan" as const, label: "Buyers", count: stats.data?.byType?.buyer_plan },
    { key: "seller" as const, label: "Sellers", count: stats.data?.byType?.seller },
    { key: "contact" as const, label: "Contacts", count: stats.data?.byType?.contact },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="bg-primary border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white text-primary p-1.5 rounded-sm">
            <HomeIcon size={16} />
          </div>
          <span className="font-serif font-bold text-white text-lg">Go Big Al Williams</span>
          <span className="text-white/40 text-sm ml-2 hidden sm:inline">/ Admin</span>
        </Link>
        <Button
          variant="ghost" size="sm"
          onClick={handleLogout}
          className="text-white/70 hover:text-white hover:bg-white/10"
          data-testid="button-logout"
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </header>

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {/* Main Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setMainTab("leads")}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${mainTab === "leads" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
              data-testid="tab-main-leads"
            >
              <Users size={15} className="inline mr-2 mb-0.5" />Leads
            </button>
            <button
              onClick={() => setMainTab("properties")}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${mainTab === "properties" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
              data-testid="tab-main-properties"
            >
              <Building2 size={15} className="inline mr-2 mb-0.5" />Properties
            </button>
          </div>
        </div>

        {/* ── LEADS TAB ──────────────────────────────────────────────────────── */}
        {mainTab === "leads" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, i) => (
                <Card key={i} className="p-5 border border-border" data-testid={`stat-card-${i}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center">{stat.icon}</div>
                  </div>
                  <p className="text-3xl font-serif font-bold text-primary">{stat.value}</p>
                </Card>
              ))}
            </div>

            {/* Leads Panel */}
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <Card className="border border-border overflow-hidden">
                  <div className="border-b border-border flex overflow-x-auto">
                    {leadTabs.map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => { setActiveLeadTab(tab.key); setSelectedLeadId(null); }}
                        className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeLeadTab === tab.key ? "border-accent text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}
                        data-testid={`tab-leads-${tab.key}`}
                      >
                        {tab.label}
                        {tab.count !== undefined && <span className="ml-1.5 text-xs bg-secondary rounded-full px-1.5 py-0.5">{tab.count}</span>}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-b border-border">
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input type="search" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm h-9" data-testid="input-search" />
                    </div>
                  </div>
                  <div className="divide-y divide-border max-h-[560px] overflow-y-auto" data-testid="lead-list">
                    {leads.isLoading ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
                    ) : !leads.data || leads.data.length === 0 ? (
                      <div className="p-10 text-center"><Inbox size={28} className="text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground text-sm">No leads found</p></div>
                    ) : leads.data.map((lead) => (
                      <button key={lead.id} onClick={() => setSelectedLeadId(lead.id)} className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${selectedLeadId === lead.id ? "bg-secondary/80" : ""}`} data-testid={`lead-row-${lead.id}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-primary text-sm truncate">{lead.fullName}</p>
                            <p className="text-muted-foreground text-xs truncate mt-0.5">{lead.email}</p>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[lead.type] ?? ""}`}>{TYPE_LABELS[lead.type] ?? lead.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.status] ?? ""}`}>{STATUS_LABELS[lead.status] ?? lead.status}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{formatDate(lead.createdAt)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Lead Detail */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {selectedLeadId && selectedLead.data ? (
                    <motion.div key={selectedLeadId} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Card className="border border-border overflow-hidden" data-testid="lead-detail">
                        <div className="p-6 border-b border-border bg-secondary/20 flex items-start justify-between gap-4">
                          <div>
                            <h2 className="font-bold text-primary text-xl">{selectedLead.data.fullName}</h2>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[selectedLead.data.type] ?? ""}`}>{TYPE_LABELS[selectedLead.data.type] ?? selectedLead.data.type}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(selectedLead.data.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDeleteLeadConfirmId(selectedLeadId)}
                              className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                              title="Delete lead"
                              data-testid="button-delete-lead"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button onClick={() => setSelectedLeadId(null)} className="text-muted-foreground hover:text-primary p-1"><X size={18} /></button>
                          </div>
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                              <Phone size={15} className="text-accent flex-shrink-0" />
                              <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium text-primary">{selectedLead.data.phone}</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                              <Mail size={15} className="text-accent flex-shrink-0" />
                              <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium text-primary truncate">{selectedLead.data.email}</p></div>
                            </div>
                          </div>
                          {leadData && Object.keys(leadData).length > 0 && (
                            <div>
                              <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Submission Details</h3>
                              <div className="bg-secondary/20 rounded-lg divide-y divide-border overflow-hidden">
                                {Object.entries(leadData).filter(([, v]) => v).map(([key, val]) => (
                                  <div key={key} className="flex gap-4 px-4 py-2.5 text-sm">
                                    <span className="text-muted-foreground capitalize min-w-[120px] flex-shrink-0">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                                    <span className="text-primary font-medium">{val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Lead Status</h3>
                            <Select value={selectedStatus} onValueChange={handleLeadStatusChange}>
                              <SelectTrigger className="w-full" data-testid="select-lead-status"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {Object.entries(STATUS_LABELS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Internal Notes</h3>
                            <Textarea value={notes} onChange={e => { setNotes(e.target.value); setNotesSaved(false); }} rows={4} placeholder="Add notes..." className="resize-none" data-testid="textarea-notes" />
                            <div className="flex items-center justify-between mt-3">
                              {notesSaved && <p className="text-xs text-green-600">Saved</p>}
                              <Button size="sm" onClick={handleSaveNotes} disabled={updateLead.isPending} className="ml-auto" data-testid="button-save-notes">{updateLead.isPending ? "Saving..." : "Save Notes"}</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Card className="border border-border h-80 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4"><Users size={24} className="text-muted-foreground" /></div>
                        <p className="font-medium text-primary mb-1">Select a Lead</p>
                        <p className="text-muted-foreground text-sm">Click any lead to view details, update status, and add notes.</p>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}

        {/* ── PROPERTIES TAB ─────────────────────────────────────────────────── */}
        {mainTab === "properties" && (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-primary">Property Management</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Add, edit, move to sold, or remove listings</p>
              </div>
              <Button onClick={openAddListing} data-testid="button-add-property">
                <Plus size={16} className="mr-2" /> Add Property
              </Button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-5 bg-secondary rounded-lg p-1 w-fit">
              {(["all", "active", "sold"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setPropertyFilter(f)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${propertyFilter === f ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                  data-testid={`filter-${f}`}
                >
                  {f} {f !== "all" && <span className="ml-1 text-xs">({listings.filter(l => l.status === f).length})</span>}
                  {f === "all" && <span className="ml-1 text-xs">({listings.length})</span>}
                </button>
              ))}
            </div>

            {listingsLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-secondary animate-pulse rounded-lg" />)}
              </div>
            ) : listingsError ? (
              <Card className="p-16 text-center border border-destructive/40 bg-destructive/5">
                <AlertTriangle size={32} className="text-destructive mx-auto mb-4" />
                <p className="font-medium text-primary mb-1">Could not load properties</p>
                <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">{listingsError}</p>
                <Button variant="outline" onClick={loadListings}>Retry</Button>
              </Card>
            ) : filteredListings.length === 0 ? (
              <Card className="p-16 text-center border border-border">
                <Building2 size={32} className="text-muted-foreground mx-auto mb-4" />
                <p className="font-medium text-primary mb-1">No properties yet</p>
                <p className="text-muted-foreground text-sm mb-5">Click "Add Property" to create your first listing.</p>
                <Button onClick={openAddListing}><Plus size={15} className="mr-2" /> Add Property</Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="property-list">
                {filteredListings.map(listing => (
                  <Card key={listing.id} className="overflow-hidden border border-border group" data-testid={`property-card-${listing.id}`}>
                    <div className="relative h-44 overflow-hidden bg-secondary">
                      {listing.imageUrl ? (
                        <img src={listing.imageUrl} alt={listing.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Image size={28} className="text-muted-foreground" /></div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge className={listing.status === "active" ? "bg-green-600 text-white" : "bg-primary text-white"}>
                          {listing.status === "active" ? "Active" : "Sold"}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-accent text-primary font-bold">{formatPrice(listing.price)}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-primary truncate">{listing.address}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{listing.city}, {listing.state} {listing.zip} — {listing.beds}bd / {listing.baths}ba / {listing.sqft.toLocaleString()} sf</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => openEditListing(listing)} className="flex-1" data-testid={`button-edit-${listing.id}`}>
                          <Pencil size={13} className="mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(listing)}
                          className={`flex-1 ${listing.status === "active" ? "border-primary/30 text-primary hover:bg-primary/5" : "border-green-600/30 text-green-700 hover:bg-green-50"}`}
                          data-testid={`button-toggle-status-${listing.id}`}
                        >
                          {listing.status === "active"
                            ? <><ToggleRight size={13} className="mr-1" /> Mark Sold</>
                            : <><ToggleLeft size={13} className="mr-1" /> Mark Active</>}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirmId(listing.id)}
                          className="text-destructive border-destructive/30 hover:bg-destructive/5"
                          data-testid={`button-delete-${listing.id}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Listing Form Slide-over ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showListingForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowListingForm(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col"
              data-testid="listing-form-panel"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between flex-shrink-0">
                <h2 className="font-serif font-bold text-primary text-xl">
                  {editingListing ? "Edit Property" : "Add New Property"}
                </h2>
                <button onClick={() => setShowListingForm(false)} className="text-muted-foreground hover:text-primary p-1"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <Form {...listingForm}>
                  <form id="listing-form" onSubmit={listingForm.handleSubmit(onListingSubmit)} className="space-y-5">
                    {/* Status */}
                    <FormField control={listingForm.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active (For Sale)</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Price */}
                    <FormField control={listingForm.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($) *</FormLabel>
                        <FormControl><Input type="number" placeholder="850000" data-testid="input-price" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Address */}
                    <FormField control={listingForm.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl><Input placeholder="1234 Oak Street" data-testid="input-address" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-3 gap-3">
                      <FormField control={listingForm.control} name="city" render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>City *</FormLabel>
                          <FormControl><Input placeholder="Austin" data-testid="input-city" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={listingForm.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <FormControl><Input placeholder="CA" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={listingForm.control} name="zip" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP *</FormLabel>
                          <FormControl><Input placeholder="78701" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <FormField control={listingForm.control} name="beds" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beds *</FormLabel>
                          <FormControl><Input type="number" step="1" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={listingForm.control} name="baths" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baths *</FormLabel>
                          <FormControl><Input type="number" step="0.5" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={listingForm.control} name="sqft" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sq Ft *</FormLabel>
                          <FormControl><Input type="number" step="1" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    {/* Short Description */}
                    <FormField control={listingForm.control} name="shortDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description * <span className="text-xs text-muted-foreground font-normal">(shown on cards)</span></FormLabel>
                        <FormControl><Textarea rows={2} placeholder="One-line summary shown in listing cards..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Full Description */}
                    <FormField control={listingForm.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description *</FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Detailed property description..." data-testid="textarea-description" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Image URL */}
                    <FormField control={listingForm.control} name="imageUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL *</FormLabel>
                        <FormControl><Input placeholder="https://images.unsplash.com/..." data-testid="input-imageUrl" {...field} /></FormControl>
                        <FormMessage />
                        {field.value && <img src={field.value} alt="" className="mt-2 h-24 w-full object-cover rounded-md" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                      </FormItem>
                    )} />

                    {/* Additional Images */}
                    <FormField control={listingForm.control} name="imagesRaw" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Image URLs <span className="text-xs text-muted-foreground font-normal">(one per line)</span></FormLabel>
                        <FormControl><Textarea rows={3} placeholder={"https://...\nhttps://..."} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Features */}
                    <FormField control={listingForm.control} name="featuresRaw" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features <span className="text-xs text-muted-foreground font-normal">(one per line)</span></FormLabel>
                        <FormControl><Textarea rows={4} placeholder={"Chef's kitchen\nHardwood floors\nPool"} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Sold fields */}
                    {listingForm.watch("status") === "sold" && (
                      <>
                        <FormField control={listingForm.control} name="soldDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sold Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={listingForm.control} name="soldDescription" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sold Story <span className="text-xs text-muted-foreground font-normal">(shown on Recently Sold page)</span></FormLabel>
                            <FormControl><Textarea rows={3} placeholder="Represented our sellers with multiple offers..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </>
                    )}
                  </form>
                </Form>
              </div>
              <div className="px-6 py-4 border-t border-border flex gap-3 flex-shrink-0 bg-white">
                <Button variant="outline" className="flex-1" onClick={() => setShowListingForm(false)}>Cancel</Button>
                <Button type="submit" form="listing-form" className="flex-1" disabled={formSaving} data-testid="button-save-listing">
                  {formSaving ? "Saving..." : editingListing ? "Save Changes" : "Add Property"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Lead Confirm Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {deleteLeadConfirmId !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setDeleteLeadConfirmId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Card className="p-8 max-w-sm w-full text-center border border-border shadow-xl" data-testid="delete-lead-confirm-dialog">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={26} className="text-red-500" />
                </div>
                <h3 className="font-bold text-primary text-lg mb-2">Delete Lead?</h3>
                <p className="text-muted-foreground text-sm mb-6">This will permanently remove this lead and cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteLeadConfirmId(null)}>Cancel</Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteLeadLoading}
                    onClick={() => deleteLeadConfirmId !== null && deleteLead(deleteLeadConfirmId)}
                    data-testid="button-confirm-delete-lead"
                  >
                    {deleteLeadLoading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setDeleteConfirmId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Card className="p-8 max-w-sm w-full text-center border border-border shadow-xl" data-testid="delete-confirm-dialog">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={26} className="text-red-500" />
                </div>
                <h3 className="font-bold text-primary text-lg mb-2">Delete Property?</h3>
                <p className="text-muted-foreground text-sm mb-6">This will permanently remove the listing and cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteLoading}
                    onClick={() => deleteConfirmId !== null && deleteListing(deleteConfirmId)}
                    data-testid="button-confirm-delete"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
