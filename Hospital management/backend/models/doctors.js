import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({

    doctorId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },

    experience: {
        type: Number
    },

    fee: {
        type: Number
    },

    status: {
        type: String,
        default: "Active"
    }

});

export default mongoose.model("Doctor", doctorSchema);