import { pgTable, text, serial, timestamp, integer, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listingStatusEnum = pgEnum("listing_status", ["active", "sold"]);

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  status: listingStatusEnum("status").notNull().default("active"),
  price: integer("price").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  beds: integer("beds").notNull(),
  baths: real("baths").notNull(),
  sqft: integer("sqft").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  soldDescription: text("sold_description"),
  imageUrl: text("image_url").notNull(),
  images: text("images").array().notNull().default([]),
  features: text("features").array().notNull().default([]),
  soldDate: text("sold_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
