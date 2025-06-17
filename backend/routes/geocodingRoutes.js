
import express from "express";
import { buscarDireccion } from "../controllers/geocodingController.js";

const router = express.Router();


router.get("/buscar", buscarDireccion);


router.get("/test", (req, res) => {
  res.status(200).send("¡La ruta de geocoding SÍ funciona!");
});

export default router;