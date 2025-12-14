const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const PORT = 5000;

const path = require('path');

const startTestServer = async () => {
  try {
    const mongod = await MongoMemoryServer.create({
        instance: {
            dbPath: path.join(__dirname, '../data/db'),
            storageEngine: 'wiredTiger'
        }
    });
    const uri = mongod.getUri();
    
    console.log(`Test MongoDB running at: ${uri}`);
    
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');

    app.listen(PORT, () => {
      console.log(`Test Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start test server:', error);
  }
};

startTestServer();
