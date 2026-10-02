import mongoose from "mongoose";

const billSchema = new mongoose.Schema({

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    doctorFee: {
        type: Number,
        default: 0
    },

    medicineFee: {
        type: Number,
        default: 0
    },

    otherCharges: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        default: 0
    },

    paidAmount: {
        type: Number,
        default: 0
    },

    dueAmount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "Unpaid"
    }

});

export default mongoose.model("Bill", billSchema);