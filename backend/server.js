import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mayoristaRoutes from "./routes/mayoristaRoutes.js";
import minoristaRoutes from "./routes/minoristaRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import whatsAppRoutes from "./routes/whatsAppRoutes.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/db.js";
import mercadoPagoRoutes from "./routes/mercadoPagoRoutes.js";

// Configuración de dotenv para acceder a las variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL_PROD  
        : process.env.FRONTEND_URL_DEV,    
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

// Middleware para el manejo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
connectDB();

// Manejo de cookies
app.use(cookieParser());

// Rutas del backend
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mayorista", mayoristaRoutes);
app.use("/api/minorista", minoristaRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/whatsapp", whatsAppRoutes);
app.use("/api/mercadopago", mercadoPagoRoutes);

// Ruta raíz
app.get("/", (req, res) => res.send("Express on Vercel"));


const PORT = process.env.PORT || 3000; 

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exporta la aplicación para ser utilizada en Vercel
export default app;
