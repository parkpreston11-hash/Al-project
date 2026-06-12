import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, listingsTable } from "@workspace/db";
import {
  GetListingsResponse,
  GetSoldListingsResponse,
  GetListingByIdParams,
  GetListingByIdResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

router.get("/listings", async (req, res): Promise<void> => {
  const listings = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.status, "active"))
    .orderBy(listingsTable.createdAt);
  res.json(GetListingsResponse.parse(serialize(listings)));
});

router.get("/listings/sold", async (req, res): Promise<void> => {
  const listings = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.status, "sold"))
    .orderBy(listingsTable.createdAt);
  res.json(GetSoldListingsResponse.parse(serialize(listings)));
});

router.get("/listings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetListingByIdParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [listing] = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.id, params.data.id));

  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }

  res.json(GetListingByIdResponse.parse(serialize(listing)));
});

export default router;
