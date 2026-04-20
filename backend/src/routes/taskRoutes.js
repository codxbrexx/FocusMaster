const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  idParamSchema,
  taskBodySchema,
  taskUpdateBodySchema,
} = require("../validation/schemas");

router
  .route("/")
  .get(protect, getTasks)
  .post(protect, validate({ body: taskBodySchema }), createTask);
router
  .route("/:id")
  .put(
    protect,
    validate({ params: idParamSchema, body: taskUpdateBodySchema }),
    updateTask,
  )
  .delete(protect, validate({ params: idParamSchema }), deleteTask);

module.exports = router;
