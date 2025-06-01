import mongoose from "mongoose";

// conexión a la base de datos
export const connectDB = async () => {
    try {
        const mongoURI = process.env.NODE_ENV === "production"
            ? process.env.MONGO_URI
            : process.env.MONGO_URI_DEV;

        // 🟡 Agrega estos logs para depuración
        console.log("🧪 Modo de ejecución:", process.env.NODE_ENV);
        console.log("🧪 URI que se está usando: [" + mongoURI + "]");


        console.log("⏳ Conectando a MongoDB...");
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`✅ Conectado a la base de datos en modo ${process.env.NODE_ENV}`);
    } catch (error) {
        console.error("❌ Error al conectarse a MongoDB:", error);
        process.exit(1);
    }
};
