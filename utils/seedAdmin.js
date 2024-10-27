// utils/seedAdmin.js
import mongoose from "mongoose";
import Admin from "../models/adminModel.js";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

const adminCredentials = {
  username: "admin", // You can change this
  password: "admin123", // You can change this
};

const seedAdmin = async () => {
  try {
    await connectDB();

    // Clear existing admin
    await Admin.deleteMany();

    // Create new admin
    await Admin.create(adminCredentials);

    console.log("Admin seeded successfully");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
