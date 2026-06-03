const express = require("express");
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getSessionStats,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  idParamSchema,
  sessionBodySchema,
  sessionQuerySchema,
  sessionUpdateBodySchema,
} = require("../validation/schemas");

router
  .route("/")
  .get(protect, apiLimiter, validate({ query: sessionQuerySchema }), getSessions)
  .post(protect, apiLimiter, validate({ body: sessionBodySchema }), createSession);
router.get("/stats", protect, apiLimiter, getSessionStats);
router
  .route("/:id")
  .get(protect, apiLimiter, validate({ params: idParamSchema }), getSession)
  .patch(
    protect,
    apiLimiter,
    validate({ params: idParamSchema, body: sessionUpdateBodySchema }),
    updateSession,
  )
  .delete(protect, apiLimiter, validate({ params: idParamSchema }), deleteSession);

module.exports = router;
