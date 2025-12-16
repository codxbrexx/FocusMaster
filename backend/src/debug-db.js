require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

const checkConnection = async () => {
    console.log('Testing connection to:', process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connection Successful!');
        process.exit(0);
    } catch (error) {
        console.error('Connection Failed:', error.message);
        process.exit(1);
    }
};

checkConnection();
