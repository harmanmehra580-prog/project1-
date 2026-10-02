import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/users.js";
import requireAuth, { getSecret } from "../middleware/auth.js";
import { validateEmail, validatePassword, validateRequestBody } from "../middleware/validators.js";
import { logAudit } from "../middleware/auditLogger.js";

const router = express.Router();

const requireAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Only administrators can manage users." });
    }
    next();
};

router.post("/login", async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: "MongoDB is not connected." });
    }

    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
        await logAudit(null, email, "Unknown", "LOGIN", "User", "", {}, req.ip, req.get("user-agent"), "failure", "Email and password are required.");
        return res.status(400).json({ message: "Email and password are required." });
    }

    if (!validateEmail(email)) {
        await logAudit(null, email, "Unknown", "LOGIN", "User", "", {}, req.ip, req.get("user-agent"), "failure", "Invalid email format.");
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {
        const user = await User.findOne({ email });

        if (user && user.locked) {
            await logAudit(user._id, email, user.role, "LOGIN", "User", user._id, {}, req.ip, req.get("user-agent"), "failure", "Account is locked.");
            return res.status(403).json({ message: "Account is locked. Please contact an administrator." });
        }

        const passwordMatches = user && await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            if (user) {
                user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
                if (user.failedLoginAttempts >= 5) {
                    user.locked = true;
                }
                await user.save();
                await logAudit(user._id, email, user.role, "LOGIN", "User", user._id, {}, req.ip, req.get("user-agent"), "failure", "Invalid credentials.");
            }
            return res.status(401).json({ message: "Invalid email or password." });
        }

        user.failedLoginAttempts = 0;
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                patientId: user.patientId,
                doctorId: user.doctorId
            },
            getSecret(),
            { expiresIn: "8h", algorithm: "HS256" }
        );

        await logAudit(user._id, email, user.role, "LOGIN", "User", user._id, {}, req.ip, req.get("user-agent"), "success");

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, patientId: user.patientId, doctorId: user.doctorId }
        });
    } catch (error) {
        await logAudit(null, email, "Unknown", "LOGIN", "User", "", {}, req.ip, req.get("user-agent"), "failure", error.message);
        res.status(500).json({ message: "Unable to sign in.", error: error.message });
    }
});

router.post("/users", requireAuth, requireAdmin, async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: "MongoDB is not connected." });
    }

    const { name, email, password, role, patientId, doctorId } = req.body;

    const errors = validateRequestBody(req.body, ["name", "email", "password", "role"]);
    if (errors) {
        return res.status(400).json({ message: "Validation failed.", errors });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters (!@#$%^&*)."
        });
    }

    if (!["Admin", "Doctor", "Receptionist", "Patient"].includes(role)) {
        return res.status(400).json({ message: "Invalid role." });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            await logAudit(req.user.id, req.user.email, req.user.role, "CREATE", "User", "", { email }, req.ip, req.get("user-agent"), "failure", "User already exists.");
            return res.status(409).json({ message: "A user with this email already exists." });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: await bcrypt.hash(password, 12),
            role,
            patientId,
            doctorId
        });

        await logAudit(req.user.id, req.user.email, req.user.role, "CREATE", "User", user._id, { email, role }, req.ip, req.get("user-agent"), "success");

        res.status(201).json({
            message: "User access created.",
            user: { id: user._id, name: user.name, email: user.email, role: user.role, patientId: user.patientId, doctorId: user.doctorId }
        });
    } catch (error) {
        await logAudit(req.user.id, req.user.email, req.user.role, "CREATE", "User", "", { email, role }, req.ip, req.get("user-agent"), "failure", error.message);
        res.status(400).json({ message: "Unable to create user.", error: error.message });
    }
});

export default router;