import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userEmail: String,
        userRole: String,
        action: {
            type: String,
            enum: ["CREATE", "READ", "UPDATE", "DELETE", "LOGIN", "LOGOUT"],
            required: true
        },
        resourceType: {
            type: String,
            enum: ["Patient", "Appointment", "Bill", "Prescription", "LabTest", "Doctor", "Department", "User"],
            required: true
        },
        resourceId: String,
        details: mongoose.Schema.Types.Mixed,
        ipAddress: String,
        userAgent: String,
        status: {
            type: String,
            enum: ["success", "failure"],
            default: "success"
        },
        errorMessage: String
    },
    { timestamps: true }
);

auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
