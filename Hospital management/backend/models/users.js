import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["Admin", "Doctor", "Receptionist", "Patient"],
      default: "Patient"
    },

    patientId: {
      type: String,
      ref: "Patient",
      sparse: true,
      index: true
    },

    doctorId: {
      type: String,
      ref: "Doctor",
      sparse: true,
      index: true
    },

    lastLogin: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    locked: {
      type: Boolean,
      default: false
    },
    passwordChangedAt: Date
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
