import cors from "cors";
import dns from "node:dns";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import labTestRoutes from "./routes/labTestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import requireAuth, { authorize } from "./middleware/auth.js";
import { apiLimiter, loginLimiter } from "./middleware/rateLimiter.js";
import { auditMiddleware } from "./middleware/auditLogger.js";

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
}

dns.setServers((process.env.DNS_SERVERS || "10.100.40.224,192.168.1.1").split(","));

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(auditMiddleware);
app.use(apiLimiter);

app.use("/api/auth", loginLimiter, authRoutes);

const staffOnly = [requireAuth, authorize("Admin", "Doctor", "Receptionist")];

app.use("/api/patients", ...staffOnly, patientRoutes);
app.use("/api/appointments", ...staffOnly, appointmentRoutes);
app.use("/api/doctors", ...staffOnly, doctorRoutes);
app.use("/api/departments", ...staffOnly, departmentRoutes);
app.use("/api/bills", ...staffOnly, billRoutes);
app.use("/api/prescriptions", ...staffOnly, prescriptionRoutes);
app.use("/api/labtests", ...staffOnly, labTestRoutes);

app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid authentication token." });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }

    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === "production"
            ? "An internal error occurred."
            : err.message || "An unexpected error occurred."
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Hospital Management API is running!",
        status: "ok"
    });
});

app.get("/api/health", async (req, res) => {
    const dbStatus = await connectDB();
    res.json({
        status: dbStatus ? "ok" : "database-unavailable",
        message: dbStatus ? "Database connected" : "MongoDB is not reachable right now",
        dbConnected: dbStatus
    });
});

connectDB()
    .then((dbConnected) => {
        app.locals.dbConnected = dbConnected;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
            if (!dbConnected) {
                console.log("App started without MongoDB. Configure MONGO_URI for full functionality.");
            }
        });
    });
