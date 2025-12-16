const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const PORT = 5000; 

const startServer = async () => {
  try {
    // Start In-Memory MongoDB
    console.log('Starting embedded MongoDB...');
    const mongod = await MongoMemoryServer.create({
        instance: {
            port: 27017,         
      }
    });
    const uri = mongod.getUri();
    console.log(`MongoMemoryServer started at ${uri}`);

    // Overwrite env var for Mongoose connection
    process.env.MONGO_URI = uri;

    // Connect to DB
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Start Express App
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
