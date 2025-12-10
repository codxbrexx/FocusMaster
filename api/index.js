const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

connectDB();

module.exports = app;
