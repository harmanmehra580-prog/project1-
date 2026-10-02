import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "node:dns";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/users.js";

dotenv.config();
dns.setServers((process.env.DNS_SERVERS || "10.100.40.224,192.168.1.1").split(","));

const createAdmin = async () => {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 16) {
        throw new Error("ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters are required.");
    }

    if (!(await connectDB())) {
        process.exitCode = 1;
        return;
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log(`Admin account already exists for ${email}`);
        return;
    }

    await User.create({
        name: process.env.ADMIN_NAME || "CarePoint Admin",
        email,
        password: await bcrypt.hash(password, 12),
        role: "Admin"
    });

    console.log(`Admin account created for ${email}`);
};

createAdmin().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
}).finally(async () => {
    await mongoose.disconnect();
});