import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] WARNING: DATABASE_URL is not set. Database queries will fail at runtime.",
  );
}

// Detect remote database (Neon / Supabase / etc.) to configure SSL and
// serverless-safe pool settings automatically.
const connectionString = process.env.DATABASE_URL;
const isRemote =
  !!connectionString &&
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  // Remote databases (Neon, Supabase, Railway) require SSL.
  // rejectUnauthorized: false trusts the server certificate without a local CA
  // bundle, which is required in some Lambda / Netlify Function environments.
  ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
  // Serverless-safe pool settings: keep only 1 connection per invocation,
  // release it quickly so the function can exit cleanly.
  max: 1,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
