import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, and, ilike, desc, or } from "drizzle-orm";
import { db, leadsTable, listingsTable, insertListingSchema } from "@workspace/db";
import {
  AdminLoginBody,
  GetAdminLeadsQueryParams,
  GetAdminLeadByIdParams,
  UpdateAdminLeadParams,
  UpdateAdminLeadBody,
  GetAdminLeadsResponse,
  GetAdminLeadByIdResponse,
  UpdateAdminLeadResponse,
  AdminLoginResponse,
  GetAdminStatsResponse,
} from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const ADMIN_TOKEN = "realty-admin-token-2024";

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

const ListingBody = insertListingSchema;
const ListingUpdateBody = insertListingSchema.partial();

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  res.json(AdminLoginResponse.parse({ token: ADMIN_TOKEN, success: true }));
});

// ── Admin listings management ──────────────────────────────────────────────

router.get("/admin/listings", requireAdmin, async (req, res): Promise<void> => {
  const listings = await db
    .select()
    .from(listingsTable)
    .orderBy(desc(listingsTable.createdAt));
  res.json(serialize(listings));
});

router.post("/admin/listings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { status, ...rest } = parsed.data;
  const [listing] = await db
    .insert(listingsTable)
    .values({ ...rest, status: status ?? "active" })
    .returning();
  res.status(201).json(serialize(listing));
});

router.patch("/admin/listings/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = ListingUpdateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [listing] = await db
    .update(listingsTable)
    .set(parsed.data)
    .where(eq(listingsTable.id, id))
    .returning();
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  res.json(serialize(listing));
});

router.delete("/admin/listings/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [listing] = await db
    .delete(listingsTable)
    .where(eq(listingsTable.id, id))
    .returning();
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  res.status(200).json({ success: true });
});

// ── Admin leads ────────────────────────────────────────────────────────────

router.get("/admin/leads", requireAdmin, async (req, res): Promise<void> => {
  const queryParams = GetAdminLeadsQueryParams.safeParse(req.query);
  if (!queryParams.success) {
    res.status(400).json({ error: queryParams.error.message });
    return;
  }
  const { type, status, search } = queryParams.data;
  let query = db.select().from(leadsTable).$dynamic();
  const conditions = [];
  if (type && type !== "all") {
    conditions.push(eq(leadsTable.type, type as "contact" | "seller" | "buyer_plan"));
  }
  if (status) {
    conditions.push(eq(leadsTable.status, status as "new" | "contacted" | "appointment_scheduled" | "active_client" | "closed"));
  }
  if (search) {
    conditions.push(
      or(
        ilike(leadsTable.fullName, `%${search}%`),
        ilike(leadsTable.email, `%${search}%`),
        ilike(leadsTable.phone, `%${search}%`)
      )
    );
  }
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  const leads = await query.orderBy(desc(leadsTable.createdAt));
  res.json(GetAdminLeadsResponse.parse(serialize(leads)));
});

router.get("/admin/leads/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAdminLeadByIdParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, params.data.id));
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.json(GetAdminLeadByIdResponse.parse(serialize(lead)));
});

router.patch("/admin/leads/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateAdminLeadParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateAdminLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;
  const [lead] = await db.update(leadsTable).set(updateData).where(eq(leadsTable.id, params.data.id)).returning();
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.json(UpdateAdminLeadResponse.parse(serialize(lead)));
});

router.get("/admin/stats", requireAdmin, async (req, res): Promise<void> => {
  const allLeads = await db.select().from(leadsTable);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const total = allLeads.length;
  const newThisWeek = allLeads.filter(l => new Date(String(l.createdAt)) >= oneWeekAgo).length;
  const byType = {
    contact: allLeads.filter(l => l.type === "contact").length,
    seller: allLeads.filter(l => l.type === "seller").length,
    buyer_plan: allLeads.filter(l => l.type === "buyer_plan").length,
  };
  const byStatus = {
    new: allLeads.filter(l => l.status === "new").length,
    contacted: allLeads.filter(l => l.status === "contacted").length,
    appointment_scheduled: allLeads.filter(l => l.status === "appointment_scheduled").length,
    active_client: allLeads.filter(l => l.status === "active_client").length,
    closed: allLeads.filter(l => l.status === "closed").length,
  };
  res.json(GetAdminStatsResponse.parse({ total, byType, byStatus, newThisWeek }));
});

export default router;
