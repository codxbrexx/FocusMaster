const mongoose = require("mongoose");

/**
 * Cached connection promise.
 *
 * On a traditional long-running server this variable lives for the full
 * process lifetime — connectDB() is called once at startup and every later
 * call finds mongoose.connection.readyState === 1 and returns immediately.
 *
 * On Vercel serverless, the module is cached between invocations of the
 * SAME warm function instance. Storing the promise here means:
 *   - First cold-start: opens a real connection and caches the promise.
 *   - Subsequent warm invocations: skip mongoose.connect() entirely and
 *     reuse the existing socket, preventing Atlas connection-pool exhaustion.
 */
let connectionPromise = null;

const MONGOOSE_OPTS = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

const connectDB = async () => {
  // Already connected (traditional server / warm serverless instance)
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Connection attempt in-flight — await the same promise instead of opening
  // a second socket.
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  try {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, MONGOOSE_OPTS);
    const conn = await connectionPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Reset so the next cold-start can try again
    connectionPromise = null;
    console.error(`Error connecting to MongoDB: ${error.message}`);

    if (process.env.NODE_ENV === "development") {
      try {
        console.log("Attempting to start in-memory MongoDB fallback...");
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log(`In-memory MongoDB started at: ${uri}`);

        connectionPromise = mongoose.connect(uri, MONGOOSE_OPTS);
        const conn = await connectionPromise;
        console.log(
          `MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`,
        );
        return;
      } catch (memError) {
        connectionPromise = null;
        console.error(`Error starting in-memory DB: ${memError.message}`);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;
