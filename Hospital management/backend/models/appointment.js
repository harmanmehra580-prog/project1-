import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        time: {
            type: String,
            required: true,
            trim: true
        },

        reason: {
            type: String,
            trim: true,
            maxlength: 500
        },

        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled"
        },

        reminderSent:{
            type:Boolean,
            default:false
        },
        reminderTime:{
            type:Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

appointmentSchema.index(
    { patient: 1, doctor: 1, date: 1, time: 1 },
    { unique: true }
);

export default mongoose.model("Appointment", appointmentSchema);