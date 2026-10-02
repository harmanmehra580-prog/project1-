import Patient from "../models/patients.js";
import Appointment from "../models/appointment.js";
import Bill from "../models/bill.js";
import Prescription from "../models/prescription.js";
import LabTest from "../models/labtest.js";

export const checkPatientOwnership = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patientId = id;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        if (req.user.role === "Patient" && req.user.patientId !== patient.patientId) {
            return res.status(403).json({ message: "You do not have permission to access this patient's records." });
        }

        req.targetPatient = patient;
        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization check failed.", error: error.message });
    }
};

export const checkAppointmentAccess = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id).populate("patient", "patientId");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        if (req.user.role === "Patient" && req.user.patientId !== appointment.patient.patientId) {
            return res.status(403).json({ message: "You do not have permission to access this appointment." });
        }

        if (req.user.role === "Doctor" && req.user.doctorId && req.user.doctorId !== String(appointment.doctor)) {
            return res.status(403).json({ message: "You can only view your own appointments." });
        }

        req.targetAppointment = appointment;
        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization check failed.", error: error.message });
    }
};

export const checkBillAccess = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findById(id).populate("patient", "patientId");

        if (!bill) {
            return res.status(404).json({ message: "Bill not found." });
        }

        if (req.user.role === "Patient" && req.user.patientId !== bill.patient.patientId) {
            return res.status(403).json({ message: "You do not have permission to access this bill." });
        }

        req.targetBill = bill;
        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization check failed.", error: error.message });
    }
};

export const checkPrescriptionAccess = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findById(id).populate("patient", "patientId").populate("doctor", "_id");

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found." });
        }

        if (req.user.role === "Patient" && req.user.patientId !== prescription.patient.patientId) {
            return res.status(403).json({ message: "You do not have permission to access this prescription." });
        }

        if (req.user.role === "Doctor" && req.user.doctorId && req.user.doctorId !== String(prescription.doctor._id)) {
            return res.status(403).json({ message: "You can only view your own prescriptions." });
        }

        req.targetPrescription = prescription;
        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization check failed.", error: error.message });
    }
};

export const checkLabTestAccess = async (req, res, next) => {
    try {
        const { id } = req.params;
        const labTest = await LabTest.findById(id).populate("patient", "patientId").populate("doctor", "_id");

        if (!labTest) {
            return res.status(404).json({ message: "Lab test not found." });
        }

        if (req.user.role === "Patient" && req.user.patientId !== labTest.patient.patientId) {
            return res.status(403).json({ message: "You do not have permission to access this lab test." });
        }

        if (req.user.role === "Doctor" && req.user.doctorId && req.user.doctorId !== String(labTest.doctor._id)) {
            return res.status(403).json({ message: "You can only view your own lab tests." });
        }

        req.targetLabTest = labTest;
        next();
    } catch (error) {
        res.status(500).json({ message: "Authorization check failed.", error: error.message });
    }
};
