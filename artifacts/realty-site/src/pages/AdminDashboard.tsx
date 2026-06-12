import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useGetAdminStats, useGetAdminLeads, useGetAdminLeadById,
  useUpdateAdminLead, getGetAdminLeadsQueryKey, getGetAdminStatsQueryKey, getGetAdminLeadByIdQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Users, TrendingUp, UserCheck, Calendar,
  Search, LogOut, Home as HomeIcon, X, Phone, Mail,
  ChevronRight, Inbox
} from "lucide-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

const STATUS_LABELS: Record<string, string> = {
  new: "New Lead",
  contacted: "Contacted",
  appointment_scheduled: "Appointment Scheduled",
  active_client: "Active Client",
  closed: "Closed",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  appointment_scheduled: "bg-purple-100 text-purple-800",
  active_client: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-600",
};

const TYPE_LABELS: Record<string, string> = {
  contact: "Contact",
  seller: "Seller",
  buyer_plan: "Buyer",
};

const TYPE_COLORS: Record<string, string> = {
  contact: "bg-accent/15 text-amber-800",
  seller: "bg-primary/10 text-primary",
  buyer_plan: "bg-green-100 text-green-800",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"all" | "contact" | "seller" | "buyer_plan">("all");
  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  // Auth check
  const token = localStorage.getItem("admin_token");
  useEffect(() => {
    if (!token) { setLocation("/admin"); return; }
    setAuthTokenGetter(() => token);
  }, [token, setLocation]);

  const stats = useGetAdminStats({ query: { enabled: !!token, queryKey: getGetAdminStatsQueryKey() } });
  const leads = useGetAdminLeads(
    { type: activeTab, search: search || undefined },
    { query: { enabled: !!token, queryKey: getGetAdminLeadsQueryKey({ type: activeTab, search: search || undefined }) } }
  );
  const selectedLead = useGetAdminLeadById(
    selectedLeadId ?? 0,
    { query: { enabled: !!selectedLeadId, queryKey: getGetAdminLeadByIdQueryKey(selectedLeadId ?? 0) } }
  );
  const updateLead = useUpdateAdminLead();

  // Sync lead detail state
  useEffect(() => {
    if (selectedLead.data) {
      setNotes(selectedLead.data.notes ?? "");
      setSelectedStatus(selectedLead.data.status);
      setNotesSaved(false);
    }
  }, [selectedLead.data]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setAuthTokenGetter(null);
    setLocation("/admin");
  }

  function handleSaveNotes() {
    if (!selectedLeadId) return;
    updateLead.mutate(
      { id: selectedLeadId, data: { notes, status: selectedStatus as "new" | "contacted" | "appointment_scheduled" | "active_client" | "closed" } },
      {
        onSuccess: () => {
          setNotesSaved(true);
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadsQueryKey({ type: activeTab, search: search || undefined }) });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadByIdQueryKey(selectedLeadId) });
        }
      }
    );
  }

  function handleStatusChange(status: string) {
    setSelectedStatus(status);
    setNotesSaved(false);
    if (!selectedLeadId) return;
    updateLead.mutate(
      { id: selectedLeadId, data: { status: status as "new" | "contacted" | "appointment_scheduled" | "active_client" | "closed" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadsQueryKey({ type: activeTab, search: search || undefined }) });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminLeadByIdQueryKey(selectedLeadId) });
        }
      }
    );
  }

  if (!token) return null;

  const statCards = [
    { label: "Total Leads", value: stats.data?.total ?? "—", icon: <Users size={20} className="text-accent" /> },
    { label: "New This Week", value: stats.data?.newThisWeek ?? "—", icon: <TrendingUp size={20} className="text-accent" /> },
    { label: "Active Clients", value: stats.data?.byStatus?.active_client ?? "—", icon: <UserCheck size={20} className="text-accent" /> },
    { label: "Appointments", value: stats.data?.byStatus?.appointment_scheduled ?? "—", icon: <Calendar size={20} className="text-accent" /> },
  ];

  const tabs = [
    { key: "all", label: "All Leads", count: stats.data?.total },
    { key: "buyer_plan", label: "Buyers", count: stats.data?.byType?.buyer_plan },
    { key: "seller", label: "Sellers", count: stats.data?.byType?.seller },
    { key: "contact", label: "Contacts", count: stats.data?.byType?.contact },
  ] as const;

  const leadData = selectedLead.data?.data as Record<string, string> | undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="bg-primary border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white text-primary p-1.5 rounded-sm">
            <HomeIcon size={16} />
          </div>
          <span className="font-serif font-bold text-white text-lg">Eleanor & Co.</span>
          <span className="text-white/40 text-sm ml-2 hidden sm:inline">/ Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white/70 hover:text-white hover:bg-white/10"
          data-testid="button-logout"
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </header>

      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary">Lead Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage and track all incoming leads</p>
        </div>

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
          {/* List */}
          <div className="lg:col-span-2">
            <Card className="border border-border overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-border">
                <div className="flex overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => { setActiveTab(tab.key); setSelectedLeadId(null); }}
                      className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                        activeTab === tab.key
                          ? "border-accent text-primary"
                          : "border-transparent text-muted-foreground hover:text-primary"
                      }`}
                      data-testid={`tab-${tab.key}`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="ml-1.5 text-xs bg-secondary rounded-full px-1.5 py-0.5">{tab.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, email, phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 text-sm h-9"
                    data-testid="input-search"
                  />
                </div>
              </div>

              {/* Lead List */}
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto" data-testid="lead-list">
                {leads.isLoading ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">Loading leads...</div>
                ) : !leads.data || leads.data.length === 0 ? (
                  <div className="p-10 text-center">
                    <Inbox size={28} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No leads found</p>
                  </div>
                ) : (
                  leads.data.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${selectedLeadId === lead.id ? "bg-secondary/80" : ""}`}
                      data-testid={`lead-row-${lead.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-primary text-sm truncate">{lead.fullName}</p>
                          <p className="text-muted-foreground text-xs truncate mt-0.5">{lead.email}</p>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[lead.type] ?? ""}`}>
                          {TYPE_LABELS[lead.type] ?? lead.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.status] ?? ""}`}>
                          {STATUS_LABELS[lead.status] ?? lead.status}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">{formatDate(lead.createdAt)}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selectedLeadId && selectedLead.data ? (
                <motion.div
                  key={selectedLeadId}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border border-border overflow-hidden" data-testid="lead-detail">
                    <div className="p-6 border-b border-border bg-secondary/20 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-bold text-primary text-xl">{selectedLead.data.fullName}</h2>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[selectedLead.data.type] ?? ""}`}>
                            {TYPE_LABELS[selectedLead.data.type] ?? selectedLead.data.type}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatDate(selectedLead.data.createdAt)}</span>
                        </div>
                      </div>
                      <button onClick={() => setSelectedLeadId(null)} className="text-muted-foreground hover:text-primary p-1">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Contact info */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                          <Phone size={15} className="text-accent flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium text-primary">{selectedLead.data.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                          <Mail size={15} className="text-accent flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium text-primary truncate">{selectedLead.data.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Form data */}
                      {leadData && Object.keys(leadData).length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Submission Details</h3>
                          <div className="bg-secondary/20 rounded-lg divide-y divide-border overflow-hidden">
                            {Object.entries(leadData).filter(([, v]) => v).map(([key, val]) => (
                              <div key={key} className="flex gap-4 px-4 py-2.5 text-sm">
                                <span className="text-muted-foreground capitalize min-w-[120px] flex-shrink-0">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="text-primary font-medium">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status */}
                      <div>
                        <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Lead Status</h3>
                        <Select value={selectedStatus} onValueChange={handleStatusChange}>
                          <SelectTrigger className="w-full" data-testid="select-lead-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notes */}
                      <div>
                        <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Internal Notes</h3>
                        <Textarea
                          value={notes}
                          onChange={e => { setNotes(e.target.value); setNotesSaved(false); }}
                          rows={4}
                          placeholder="Add notes about this lead..."
                          className="resize-none"
                          data-testid="textarea-notes"
                        />
                        <div className="flex items-center justify-between mt-3">
                          {notesSaved && <p className="text-xs text-green-600">Notes saved</p>}
                          <Button
                            size="sm"
                            onClick={handleSaveNotes}
                            disabled={updateLead.isPending}
                            className="ml-auto"
                            data-testid="button-save-notes"
                          >
                            {updateLead.isPending ? "Saving..." : "Save Notes"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full"
                >
                  <Card className="border border-border h-96 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                      <Users size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-medium text-primary mb-1">Select a Lead</p>
                    <p className="text-muted-foreground text-sm">Click any lead from the list to view details, update status, and add notes.</p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
