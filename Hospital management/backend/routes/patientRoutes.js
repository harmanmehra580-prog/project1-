import express from "express";
import mongoose from "mongoose";
import Patient from "../models/patients.js";
import { demoPatients } from "../demoData.js";
import { checkPatientOwnership } from "../middleware/authorization.js";
import { logAudit } from "../middleware/auditLogger.js";

const router = express.Router();

const isDbReady = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
    if (!isDbReady()) {
        return res.json(demoPatients);
    }

    try {
        let query = {};
        if (req.user.role === "Patient") {
            query = { patientId: req.user.patientId };
        }

        const patients = await Patient.find(query).sort({ createdAt: -1 });
        await logAudit(req.user.id, req.user.email, req.user.role, "READ", "Patient", "", {}, req.ip, req.get("user-agent"), "success");
        res.json(patients);
    } catch (error) {
        await logAudit(req.user.id, req.user.email, req.user.role, "READ", "Patient", "", {}, req.ip, req.get("user-agent"), "failure", error.message);
        res.status(500).json({
            message: "Failed to fetch patients",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    if (!isDbReady()) {
        return res.status(503).json({
            message: "Database is not connected. Please configure MongoDB first."
        });
    }

    if (req.user.role === "Patient") {
        return res.status(403).json({
            message: "Patients cannot create new patient records."
        });
    }

    try {
        const patient = await Patient.create(req.body);
        await logAudit(req.user.id, req.user.email, req.user.role, "CREATE", "Patient", patient._id, { patientId: patient.patientId }, req.ip, req.get("user-agent"), "success");
        res.status(201).json(patient);
    } catch (error) {
        await logAudit(req.user.id, req.user.email, req.user.role, "CREATE", "Patient", "", {}, req.ip, req.get("user-agent"), "failure", error.message);
        res.status(400).json({
            message: "Failed to create patient",
            error: error.message
        });
    }
});

router.delete("/:id", checkPatientOwnership, async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({
      message: "Database is not connected."
    });
  }

  if (req.user.role === "Patient") {
    return res.status(403).json({
      message: "Patients cannot delete patient records."
    });
  }

  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found."
      });
    }

    await logAudit(req.user.id, req.user.email, req.user.role, "DELETE", "Patient", req.params.id, { patientId: patient.patientId }, req.ip, req.get("user-agent"), "success");

    res.json({
      message: "Patient deleted successfully."
    });
  } catch (error) {
    await logAudit(req.user.id, req.user.email, req.user.role, "DELETE", "Patient", req.params.id, {}, req.ip, req.get("user-agent"), "failure", error.message);
    res.status(500).json({
      message: "Failed to delete patient",
      error: error.message
    });
  }
});

export default router;
