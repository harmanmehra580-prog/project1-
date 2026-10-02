import express from "express";
import mongoose from "mongoose";
import Doctor from "../models/doctors.js";
import { demoDoctors } from "../demoData.js";

const router = express.Router();
const isDbReady = () => mongoose.connection.readyState === 1;

const getDemoDoctorById = (doctorId) => demoDoctors.find((doctor) =>
  String(doctor._id) === String(doctorId) || String(doctor.doctorId) === String(doctorId)
);

const buildDoctorUpdateQuery = (doctorId) => {
  if (mongoose.Types.ObjectId.isValid(doctorId)) {
    return {
      $or: [
        { _id: new mongoose.Types.ObjectId(doctorId) },
        { doctorId: doctorId }
      ]
    };
  }

  return { doctorId: doctorId };
};

router.get("/", async (req, res) => {
  if (!isDbReady()) return res.json(demoDoctors);

  try {
    const doctors = await Doctor.find({})
      .populate("department", "name")
      .sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
  }
});

router.post("/", async (req, res) => {
  if (!isDbReady()) {
    const newDoctor = {
      ...req.body,
      _id: req.body._id || `doc${Date.now()}`,
      status: req.body.status || "Active"
    };
    demoDoctors.push(newDoctor);
    return res.status(201).json(newDoctor);
  }

  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: "Failed to create doctor", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  if (!isDbReady()) {
    const doctor = getDemoDoctorById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    Object.assign(doctor, req.body);
    return res.json(doctor);
  }

  try {
    const doctor = await Doctor.findOne(buildDoctorUpdateQuery(req.params.id));

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    Object.assign(doctor, req.body);
    await doctor.save();

    const populatedDoctor = await doctor.populate("department", "name");
    res.json(populatedDoctor);
  } catch (error) {
    res.status(400).json({ message: "Failed to update doctor", error: error.message });
  }
});

export default router;
