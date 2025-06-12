// Archivo: routes/geocodingRoutes.js
import express from "express";
import { buscarDireccion } from "../controllers/geocodingController.js";

const router = express.Router();

// RUTA ORIGINAL
router.get("/buscar", buscarDireccion);

// AÑADE ESTA RUTA DE PRUEBA
router.get("/test", (req, res) => {
  res.status(200).send("¡La ruta de geocoding SÍ funciona!");
});

export default router;