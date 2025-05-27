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
import path from "path"
import { fileURLToPath } from 'url';


dotenv.config();


const app = express();
console.log('NODE_ENV:', process.env.NODE_ENV);

// Configuración de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://wifrut-frontend.vercel.app", 
        "http://localhost:5173", 
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true, 
  })
);

// Responder a solicitudes OPTIONS
app.options('*', cors());


// Middleware para el manejo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use( express.static(path.resolve(__dirname, '../frontend/wifrut/public')));




connectDB();


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


export default app;
