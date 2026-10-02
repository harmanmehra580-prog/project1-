import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("MONGO_URI is not defined. Database connection skipped.");
            return false;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        return true;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        return false;
    }
};

export default connectDB;