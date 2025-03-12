import { Router } from "express";
import { isMayorista } from "../middlewares/isMayorista.js";
//import {isAprobado} from "../middlewares/isAprobado.js"
import { authRequired } from "../middlewares/authRequired.js";
import {
  guardarDatosMayorista,
  obtenerDatosMayorista,
} from "../controllers/mayoristaController.js";

const router = Router();

router.get(
  "/obtener-datos-mayorista",
  authRequired,
  isMayorista,
  obtenerDatosMayorista
);

router.post(
  "/guardar-datos-mayorista",
  authRequired,
  isMayorista,
  guardarDatosMayorista
);

export default router;
