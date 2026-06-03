const express = require("express");
const router = express.Router();
const { seedData } = require("../controllers/seedController");
const { apiLimiter } = require("../middleware/rateLimitMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { authSchemas } = require("../validation/schemas");

router.post("/", apiLimiter, validate({ body: authSchemas.guest }), seedData);

module.exports = router;
