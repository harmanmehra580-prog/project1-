import express from "express";
import mongoose from "mongoose";
import Appointment from "../models/appointment.js";
import { demoAppointments } from "../demoData.js";

const router = express.Router();

const isDbReady = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  if (!isDbReady()) {
    return res.json(demoAppointments);
  }

  try {
    const appointments = await Appointment.find()
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .populate("department", "name")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const appointment = await Appointment.create(req.body);
    const populatedAppointment = await appointment.populate([
      { path: "patient", select: "patientId name" },
      { path: "doctor", select: "doctorId name specialization" },
      { path: "department", select: "name" }
    ]);

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create appointment",
      error: error.message
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update appointment status.",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .populate("department", "name");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update appointment",
      error: error.message
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("patient", "patientId name")
      .populate("doctor", "doctorId name specialization")
      .populate("department", "name");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update appointment status",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json({ message: "Appointment deleted successfully." });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete appointment",
      error: error.message
    });
  }
});

export default router;
