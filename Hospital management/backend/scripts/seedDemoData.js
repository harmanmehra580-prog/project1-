import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import connectDB from "../config/db.js";
import {
  demoAppointments,
  demoBills,
  demoDepartments,
  demoDoctors,
  demoLabTests,
  demoPatients,
  demoPrescriptions
} from "../demoData.js";
import Appointment from "../models/appointment.js";
import Bill from "../models/bill.js";
import Department from "../models/department.js";
import Doctor from "../models/doctors.js";
import LabTest from "../models/labtest.js";
import Patient from "../models/patients.js";
import Prescription from "../models/prescription.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const upsert = (model, filter, data) => model.findOneAndUpdate(
  filter,
  { $set: data },
  { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
);

const seedDemoData = async () => {
  const connected = await connectDB();
  if (!connected) {
    throw new Error("Could not connect to MongoDB. Check backend/.env and MONGO_URI.");
  }

  const patients = new Map();
  for (const { _id: fixtureId, ...data } of demoPatients) {
    const patient = await upsert(Patient, { patientId: data.patientId }, data);
    patients.set(fixtureId, patient._id);
  }

  const departments = new Map();
  for (const { _id: fixtureId, ...data } of demoDepartments) {
    const department = await upsert(Department, { name: data.name }, data);
    departments.set(fixtureId, department._id);
  }

  const doctors = new Map();
  for (const { _id: fixtureId, department: departmentId, ...data } of demoDoctors) {
    const doctor = await upsert(
      Doctor,
      { doctorId: data.doctorId },
      { ...data, department: departments.get(departmentId) }
    );
    doctors.set(fixtureId, doctor._id);
  }

  for (const appointment of demoAppointments) {
    const patient = patients.get(appointment.patient._id);
    const doctor = doctors.get(appointment.doctor._id);
    const department = departments.get(appointment.department._id);
    const data = {
      patient,
      doctor,
      department,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status
    };
    await upsert(Appointment, { patient, doctor, date: data.date, time: data.time }, data);
  }

  for (const bill of demoBills) {
    const patient = patients.get(bill.patient._id);
    const data = { ...bill, patient };
    delete data._id;
    delete data.createdAt;
    await upsert(
      Bill,
      {
        patient,
        doctorFee: data.doctorFee,
        medicineFee: data.medicineFee,
        otherCharges: data.otherCharges,
        totalAmount: data.totalAmount
      },
      data
    );
  }

  for (const prescription of demoPrescriptions) {
    const patient = patients.get(prescription.patient._id);
    const doctor = doctors.get(prescription.doctor._id);
    const data = { ...prescription, patient, doctor };
    delete data._id;
    await upsert(
      Prescription,
      { patient, doctor, diagnosis: data.diagnosis, date: data.date },
      data
    );
  }

  for (const labTest of demoLabTests) {
    const patient = patients.get(labTest.patient._id);
    const doctor = doctors.get(labTest.doctor._id);
    const data = { ...labTest, patient, doctor, testId: `LT-${labTest._id}` };
    delete data._id;
    await upsert(LabTest, { testId: data.testId }, data);
  }

  console.log("Demo records added or updated in MongoDB.");
};

seedDemoData()
  .catch((error) => {
    console.error("Failed to seed demo data:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });