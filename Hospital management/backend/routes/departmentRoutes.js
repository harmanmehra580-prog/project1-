import express from "express";
import mongoose from "mongoose";
import Department from "../models/department.js";
import { demoDepartments } from "../demoData.js";

const router = express.Router();
const isDbReady = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  if (!isDbReady()) return res.json(demoDepartments);

  try {
    const departments = await Department.find({ status: "Active" }).sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments", error: error.message });
  }
});

router.post("/", async (req, res) => {
  if (!isDbReady()) return res.status(503).json({ message: "Database is not connected." });

  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: "Failed to create department", error: error.message });
  }
});

export default router;
