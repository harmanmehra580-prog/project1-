export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    return true;
};

export const validatePatientId = (patientId) => {
    return patientId && patientId.trim().length > 0 && patientId.length <= 50;
};

export const sanitizeString = (str) => {
    if (typeof str !== "string") return "";
    return str.trim().replace(/[<>]/g, "");
};

export const validateRequestBody = (body, requiredFields) => {
    const errors = [];
    requiredFields.forEach((field) => {
        if (!body[field]) {
            errors.push(`${field} is required.`);
        }
    });
    return errors.length > 0 ? errors : null;
};
