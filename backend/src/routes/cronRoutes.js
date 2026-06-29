const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const ErrorLog = require("../models/ErrorLog");
const AuditLog = require("../models/AuditLog");

/**
 * POST /api/cron/cleanup
 *
 * Vercel Cron Job endpoint — replaces the node-cron schedule that cannot
 * run on a serverless platform.
 *
 * Vercel calls this route automatically at the schedule defined in
 * vercel.json ("crons" field) — daily at 02:00 UTC.
 *
 * The route is protected by a shared secret (CRON_SECRET env var).
 * Vercel also sends the Authorization header automatically; we validate
 * it to prevent external actors from triggering cleanup manually.
 *
 * To trigger locally for testing:
 *   curl -X POST http://localhost:5000/api/cron/cleanup \
 *        -H "Authorization: Bearer <your CRON_SECRET>"
 */
router.post("/cleanup", async (req, res) => {
  // Auth guard
  const cronSecret = process.env.CRON_SECRET;

  // If no secret is configured, only allow requests from Vercel's internal
  // network (identified by the x-vercel-id header being present).
  if (cronSecret) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (token !== cronSecret) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else if (
    process.env.NODE_ENV === "production" &&
    !req.headers["x-vercel-id"]
  ) {
    // Production with no secret set AND not called by Vercel → reject
    return res
      .status(401)
      .json({ message: "CRON_SECRET is not configured. Set it in Vercel." });
  }

  // Cleanup logic (same logic that was in cleanupOldData.js)
  console.log("[Cron] Starting automated data cleanup…");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const results = {};

  try {
    // Delete sessions older than 30 days
    const deletedSessions = await Session.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
    });
    results.deletedSessions = deletedSessions.deletedCount;
    console.log(`  ✓ Deleted ${deletedSessions.deletedCount} old sessions`);
  } catch (err) {
    console.error("  ✗ Session cleanup failed:", err.message);
    results.sessionError = err.message;
  }

  try {
    // Delete error logs older than 90 days
    const deletedErrors = await ErrorLog.deleteMany({
      createdAt: { $lt: ninetyDaysAgo },
    });
    results.deletedErrorLogs = deletedErrors.deletedCount;
    console.log(`  ✓ Deleted ${deletedErrors.deletedCount} old error logs`);
  } catch (err) {
    console.error("  ✗ ErrorLog cleanup failed:", err.message);
    results.errorLogError = err.message;
  }

  try {
    // Archive audit logs older than 90 days
    const archivedAudits = await AuditLog.updateMany(
      { createdAt: { $lt: ninetyDaysAgo }, archived: false },
      { archived: true },
    );
    results.archivedAuditLogs = archivedAudits.modifiedCount;
    console.log(
      `  ✓ Archived ${archivedAudits.modifiedCount} old audit logs`,
    );
  } catch (err) {
    console.error("  ✗ AuditLog archival failed:", err.message);
    results.auditLogError = err.message;
  }

  console.log("[Cron] Cleanup complete:", results);

  const hasErrors = results.sessionError || results.errorLogError || results.auditLogError;
  return res.status(hasErrors ? 207 : 200).json({
    success: !hasErrors,
    timestamp: new Date().toISOString(),
    results,
  });
});

module.exports = router;
