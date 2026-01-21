const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);

    if (process.env.NODE_ENV === "development") {
      try {
        console.log("Attempting to start in-memory MongoDB fallback...");
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        console.log(`In-memory MongoDB started at: ${uri}`);

        const conn = await mongoose.connect(uri, {
          serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
          },
        });

        console.log(
          `MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`,
        );
        return;
      } catch (memError) {
        console.error(`Error starting in-memory DB: ${memError.message}`);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;
