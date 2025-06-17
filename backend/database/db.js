import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {

        return;
    }

    try {
        const mongoURI = process.env.NODE_ENV === "production"
            ? process.env.MONGO_URI
            : process.env.MONGO_URI_DEV;

        if (!mongoURI) {

            throw new Error("Falta definir MONGO_URI o MONGO_URI_DEV");
        }


        const db = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
        });

        isConnected = true;

    } catch (error) {

        process.exit(1);
    }
};
