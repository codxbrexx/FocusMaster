const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const { sanitizeBody } = require("../middleware/sanitizeMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  idParamSchema,
  taskBodySchema,
  taskUpdateBodySchema,
} = require("../validation/schemas");

router
  .route("/")
  .get(protect, apiLimiter, getTasks)
  .post(
    protect,
    apiLimiter,
    sanitizeBody(),
    validate({ body: taskBodySchema }),
    createTask,
  );
router
  .route("/:id")
  .put(
    protect,
    apiLimiter,
    sanitizeBody(),
    validate({ params: idParamSchema, body: taskUpdateBodySchema }),
    updateTask,
  )
  .delete(protect, apiLimiter, validate({ params: idParamSchema }), deleteTask);

module.exports = router;
