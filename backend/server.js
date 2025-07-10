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
import geocodingRoutes from "./routes/geocodingRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import mercadoPagoRoutes from "./routes/mercadoPagoRoutes.js";

//import http from "http";
//import { error } from "console";


dotenv.config();


const app = express();


const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, "../frontend/wifrut/public")));

connectDB();

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
// Rutas
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mayorista", mayoristaRoutes);
app.use("/api/minorista", minoristaRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/whatsapp", whatsAppRoutes);
app.use("/api/geocode", geocodingRoutes);
app.use("/api/mercadopago", mercadoPagoRoutes);


// Ruta raíz
app.get("/", (req, res) => res.send("Express on Vercel"));

//Iniciar servidor
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
//console.log(`Servidor corriendo en el puerto ${PORT}`);
//});


app.get("/api/test-directo", (req, res) => {
  res.status(200).send("Esta ruta directa en server.js SÍ funciona.");
});
export default app;
