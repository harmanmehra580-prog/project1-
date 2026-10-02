import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },

    testName: {
      type: String,
      required: true
    },

    testDate: {
      type: Date,
      default: Date.now
    },

    result: {
      type: String
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("LabTest", labTestSchema);
