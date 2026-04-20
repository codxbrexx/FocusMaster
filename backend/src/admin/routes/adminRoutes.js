const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/adminAuth");
const { apiLimiter } = require("../../middleware/rateLimitMiddleware");
const { sanitizeBody } = require("../../middleware/sanitizeMiddleware");
const { validate } = require("../../middleware/validateMiddleware");
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAuditLogs,
  getSystemHealth,
  getFeedback,
  updateFeedbackStatus,
} = require("../controllers/adminController");
const {
  adminFeedbackStatusBodySchema,
  adminUserStatusBodySchema,
  adminUsersQuerySchema,
  idParamSchema,
} = require("../../validation/schemas");

// All routes are protected by adminAuth
router.use(protectAdmin);
router.use(apiLimiter);

router.get("/stats", getDashboardStats);
router.get("/users", validate({ query: adminUsersQuerySchema }), getUsers);
router.put(
  "/users/:id/status",
  sanitizeBody(),
  validate({ params: idParamSchema, body: adminUserStatusBodySchema }),
  updateUserStatus,
);
router.get("/audit", getAuditLogs);
router.get("/health", getSystemHealth);
router.get("/feedback", getFeedback);
router.put(
  "/feedback/:id/status",
  validate({ params: idParamSchema, body: adminFeedbackStatusBodySchema }),
  updateFeedbackStatus,
);

module.exports = router;
