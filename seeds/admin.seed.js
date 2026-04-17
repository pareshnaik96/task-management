import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import db from "../src/models/index.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected");

    const existingAdmin = await db.User.findOne({
      email: "admin123@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    const admin = await db.User.create({
      name: "admin",
      email: "admin123@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();