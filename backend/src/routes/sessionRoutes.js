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
const { validate } = require("../middleware/validateMiddleware");
const {
  idParamSchema,
  sessionBodySchema,
  sessionQuerySchema,
  sessionUpdateBodySchema,
} = require("../validation/schemas");

router
  .route("/")
  .get(protect, validate({ query: sessionQuerySchema }), getSessions)
  .post(protect, validate({ body: sessionBodySchema }), createSession);
router.get("/stats", protect, getSessionStats);
router
  .route("/:id")
  .get(protect, validate({ params: idParamSchema }), getSession)
  .patch(
    protect,
    validate({ params: idParamSchema, body: sessionUpdateBodySchema }),
    updateSession,
  )
  .delete(protect, validate({ params: idParamSchema }), deleteSession);

module.exports = router;
