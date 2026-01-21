require("dotenv").config();
const mongoose = require("mongoose");
const Session = require("../models/Session");
const User = require("../models/User");
const { subDays, addMinutes, startOfDay } = require("date-fns");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    const user = await User.findOne({});
    if (!user) {
      console.log("No user found");
      process.exit();
    }

    console.log(`Seeding data for user: ${user.name} (${user._id})`);

    const sessions = [];
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = subDays(today, i);

      if (Math.random() > 0.4) {
        const sessionCount = Math.floor(Math.random() * 6) + 1;

        for (let j = 0; j < sessionCount; j++) {
          const startTime = addMinutes(startOfDay(date), 480 + j * 60);

          sessions.push({
            user: user._id,
            type: "focus",
            startTime: startTime,
            duration: 1500,
            completed: true,
            mood: "focused",
          });
        }
      }
    }

    await Session.insertMany(sessions);
    console.log(`Successfully seeded ${sessions.length} sessions!`);
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
