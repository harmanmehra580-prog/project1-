import express from "express";
import mongoose from "mongoose";
import Bill from "../models/bill.js";
import { demoBills } from "../demoData.js";

const router = express.Router();
const isDbReady = () => mongoose.connection.readyState === 1;

const calculateBillTotals = (payload = {}) => {
  const doctorFee = Number(payload.doctorFee) || 0;
  const medicineFee = Number(payload.medicineFee) || 0;
  const otherCharges = Number(payload.otherCharges) || 0;
  const discount = Number(payload.discount) || 0;
  const paidAmount = Number(payload.paidAmount) || 0;

  const totalAmount = doctorFee + medicineFee + otherCharges - discount;
  const dueAmount = Math.max(totalAmount - paidAmount, 0);
  const status = dueAmount === 0 ? "Paid" : paidAmount > 0 ? "Partial" : "Unpaid";

  return {
    doctorFee,
    medicineFee,
    otherCharges,
    discount,
    paidAmount,
    totalAmount,
    dueAmount,
    status
  };
};

router.get("/", async (req, res) => {
  if (!isDbReady()) {
    return res.json(demoBills);
  }

  try {
    const bills = await Bill.find()
      .populate("patient", "patientId name")
      .sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bills",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const payload = { ...req.body };
    const totals = calculateBillTotals(payload);

    const bill = await Bill.create({
      ...payload,
      ...totals
    });

    await bill.populate("patient", "patientId name");
    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create bill",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const payload = { ...req.body };
    const totals = calculateBillTotals(payload);

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { ...payload, ...totals },
      { new: true, runValidators: true }
    ).populate("patient", "patientId name");

    if (!bill) {
      return res.status(404).json({ message: "Bill not found." });
    }

    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update bill",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({ message: "Database is not connected." });
  }

  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found." });
    }

    res.json({ message: "Bill deleted successfully." });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete bill",
      error: error.message
    });
  }
});

export default router;
