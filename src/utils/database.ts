import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connectDB = async () => {
    try {
        // Pastikan DATABASE_URL sudah terdefinisi
        if (!DATABASE_URL) {
            throw new Error("Variabel lingkungan DATABASE_URL belum didefinisikan");
        }
        
        await mongoose.connect(DATABASE_URL, {
            dbName:"db-acara",
        });
        console.log("Connected to MongoDB");
        return Promise.resolve("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export default connectDB;