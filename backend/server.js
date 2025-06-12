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
import geocodingRoutes from "./routes/geocodingRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { error } from "console";


// ✨ LA LÍNEA MÁS IMPORTANTE: Cargamos las variables de entorno PRIMERO ✨
dotenv.config();

// Ahora sí, podemos usar console.log o cualquier otra cosa
console.log("--- ¡VERSIÓN DEL SERVIDOR: 12.06 - 6:30 PM! ---");
console.log("MONGO_URI check:", process.env.MONGO_URI ? "Cargada" : "NO Cargada");
const app = express();
// ==> AÑADE ESTA LÍNEA EXACTAMENTE AQUÍ <==
//app.set('trust proxy', 1);
//console.log("NODE_ENV:", process.env.NODE_ENV);

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

// Rutas
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mayorista", mayoristaRoutes);
app.use("/api/minorista", minoristaRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/whatsapp", whatsAppRoutes);
app.use("/api/mercadopago", mercadoPagoRoutes);
app.use("/api/geocode", geocodingRoutes);

// Ruta raíz
app.get("/", (req, res) => res.send("Express on Vercel"));

// Iniciar servidor
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
//console.log(`Servidor corriendo en el puerto ${PORT}`);
//});

// const port = process.env.PORT || 3000;
// app.set("port", port);

/**
 * Create HTTP server.
 */

// const server = http.createServer(app);

// /**
//  * Listen on provided port, on all network interfaces.
//  */

// // app.attach(server);
// server.listen(port, "0.0.0.0", () => {
//   console.log(`Server is running on http://0.0.0.0:${port}`);
// });
// server.on("error", (error) => {
//   if (error.syscall !== "listen") {
//     throw error;
//   }
//   const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
//   switch (error.code) {
//     case "EACCES":
//       console.error(`${bind} requires elevated privileges`);
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(`${bind} is already in use`);
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// });

export default app;
