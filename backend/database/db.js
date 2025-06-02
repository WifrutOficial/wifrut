import mongoose from "mongoose";

let isConnected = false; // ✅ Evita múltiples conexiones

export const connectDB = async () => {
    if (isConnected) {
        console.log("🟢 Ya estás conectado a MongoDB");
        return;
    }

    try {
        const mongoURI = process.env.NODE_ENV === "production"
            ? process.env.MONGO_URI
            : process.env.MONGO_URI_DEV;

        if (!mongoURI) {
            console.error("❌ mongoURI está indefinida");
            throw new Error("Falta definir MONGO_URI o MONGO_URI_DEV");
        }

        console.log("🧪 Modo de ejecución:", process.env.NODE_ENV);
        console.log("🧪 URI que se está usando:", mongoURI);

        console.log("⏳ Conectando a MongoDB...");
        const db = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
        });

        isConnected = true;
        console.log(`✅ Conectado a la base de datos en modo ${process.env.NODE_ENV}`);
    } catch (error) {
        console.error("❌ Error al conectarse a MongoDB:", error.message);
        process.exit(1);
    }
};
