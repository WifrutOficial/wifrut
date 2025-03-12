import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import  adminRoutes  from "./routes/adminRoutes.js";
import mayoristaRoutes from "./routes/mayoristaRoutes.js"
import minoristaRoutes from "./routes/minoristaRoutes.js"
import productsRoutes from "./routes/productsRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cookieParser from "cookie-parser"
import { connectDB } from "./database/db.js";

// Configuración de dotenv para acceder a las variables de entorno
dotenv.config();

const app = express();

//conexion con el forntend
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

//middleware
app.use(express.json());
// ejecucuion de la conexion a la base de datos
connectDB();

//manejo de cookies
app.use(cookieParser())

//rutas
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes)
app.use("/api/mayorista", mayoristaRoutes)
app.use("/api/minorista",minoristaRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/order" , orderRoutes)

//servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
