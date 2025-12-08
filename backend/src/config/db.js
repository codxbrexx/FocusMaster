const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Attempting to start in-memory MongoDB...');
    
    try {
      // Dynamic import to avoid issues if dependency is missing in prod
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      console.log(`In-memory MongoDB started at: ${uri}`);
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
    } catch (fallbackError) {
       console.error(`Fallback Error: ${fallbackError.message}`);
       process.exit(1);
    }
  }
};

module.exports = connectDB;
