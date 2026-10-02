import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    status: {
        type: String,
        default: "Active"
    }
});

export default mongoose.model("Department", departmentSchema);