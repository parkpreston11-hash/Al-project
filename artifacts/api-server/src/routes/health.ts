import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  let dbStatus: "ok" | "error" = "ok";
  let dbError: string | undefined;

  try {
    await pool.query("SELECT 1");
  } catch (err) {
    dbStatus = "error";
    dbError = err instanceof Error ? err.message : String(err);
  }

  const status = dbStatus === "ok" ? "ok" : "degraded";
  const data = HealthCheckResponse.parse({ status });
  res.status(dbStatus === "ok" ? 200 : 503).json({
    ...data,
    db: dbStatus,
    ...(dbError ? { dbError } : {}),
  });
});

export default router;
