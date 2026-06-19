const { MongoMemoryServer } = require("mongodb-memory-server");

/**
 * Jest global setup – downloads the MongoDB binary once before any test suite.
 * This prevents each test file from downloading concurrently and timing out.
 */
module.exports = async function globalSetup() {
  // This triggers the binary download if not already cached.
  const mongod = await MongoMemoryServer.create();
  await mongod.stop();
};
