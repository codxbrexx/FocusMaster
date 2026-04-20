const express = require("express");
const router = express.Router();
const { seedData } = require("../controllers/seedController");
const { validate } = require("../middleware/validateMiddleware");
const { authSchemas } = require("../validation/schemas");

router.post("/", validate({ body: authSchemas.guest }), seedData);

module.exports = router;
