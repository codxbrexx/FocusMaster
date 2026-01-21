const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/focusmaster",
    ); // Fallback if env not set
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({
      email: "admin@focusmaster.com",
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      // Ensure role is admin
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("Updated existing user to admin role");
      }
    } else {
      const admin = await User.create({
        name: "Test Admin",
        email: "admin@focusmaster.com",
        password: "admin123", // Will be hashed by pre-save hook
        role: "admin",
      });
      console.log("Admin created successfully:", admin.email);
    }
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
