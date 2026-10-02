import express from "express";
import mongoose from "mongoose";
import LabTest from "../models/labtest.js";
import { demoLabTests } from "../demoData.js";

const router = express.Router();
const isDbReady = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  if (!isDbReady()) {
    return res.json(demoLabTests);
  }

  try {
    const tests = await LabTest.find()
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .sort({ testDate: -1 });

    res.json(tests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lab tests",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const labTest = await LabTest.create(req.body);
    const populatedTest = await labTest.populate([
      { path: "patient", select: "patientId name" },
      { path: "doctor", select: "doctorId name specialization" }
    ]);

    res.status(201).json(populatedTest);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create lab test",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const labTest = await LabTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization");

    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found." });
    }

    res.json(labTest);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update lab test",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const labTest = await LabTest.findByIdAndDelete(req.params.id);

    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found." });
    }

    res.json({ message: "Lab test deleted successfully." });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete lab test",
      error: error.message
    });
  }
});

export default router;
