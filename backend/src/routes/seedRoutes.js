const express = require('express');
const router = express.Router();
const { seedData } = require('../controllers/seedController');

router.post('/', seedData);

module.exports = router;
