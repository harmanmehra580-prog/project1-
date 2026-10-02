import AuditLog from "../models/auditLog.js";

export const logAudit = async (userId, userEmail, userRole, action, resourceType, resourceId, details = {}, ipAddress = "", userAgent = "", status = "success", errorMessage = "") => {
    try {
        await AuditLog.create({
            userId,
            userEmail,
            userRole,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress,
            userAgent,
            status,
            errorMessage
        });
    } catch (error) {
        console.error("Failed to log audit trail:", error.message);
    }
};

export const auditMiddleware = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        res.json = originalJson;

        const statusCode = res.statusCode;
        const isSuccess = statusCode >= 200 && statusCode < 300;

        req.auditData = {
            status: isSuccess ? "success" : "failure",
            statusCode,
            responseData: isSuccess ? data : undefined,
            errorMessage: !isSuccess ? data?.message || "Unknown error" : undefined
        };

        return originalJson.call(this, data);
    };

    next();
};
