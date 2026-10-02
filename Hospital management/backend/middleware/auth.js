import jwt from "jsonwebtoken";

export const getSecret = () => {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be configured with at least 32 characters.");
    }
    return secret;
};

export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "You do not have permission to perform this action." });
    }
    next();
};

const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length).trim()
        : null;

    if (!token) {
        return res.status(401).json({ message: "Authentication required." });
    }

    try {
        req.user = jwt.verify(token, getSecret(), { algorithms: ["HS256"] });
        next();
    } catch {
        res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }
};

export default requireAuth;