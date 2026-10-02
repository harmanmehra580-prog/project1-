import express from "express";
import mongoose from "mongoose";
import Prescription from "../models/prescription.js";
import { demoPrescriptions } from "../demoData.js";

const router = express.Router();
const isDbReady = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  if (!isDbReady()) {
    return res.json(demoPrescriptions);
  }

  try {
    const prescriptions = await Prescription.find()
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .sort({ date: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch prescriptions",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const prescription = await Prescription.create(req.body);
    const populatedPrescription = await prescription.populate([
      { path: "patient", select: "patientId name" },
      { path: "doctor", select: "doctorId name specialization" }
    ]);

    res.status(201).json(populatedPrescription);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create prescription",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    res.json(prescription);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update prescription",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    res.json({ message: "Prescription deleted successfully." });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete prescription",
      error: error.message
    });
  }
});

export default router;
