import { pgTable, text, serial, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadTypeEnum = pgEnum("lead_type", ["contact", "seller", "buyer_plan"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "appointment_scheduled", "active_client", "closed"]);

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  type: leadTypeEnum("type").notNull(),
  status: leadStatusEnum("status").notNull().default("new"),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  notes: text("notes"),
  data: jsonb("data").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
