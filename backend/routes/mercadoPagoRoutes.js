import { Router } from "express";
import {
  createOrderAndPreference,
  saveMercadoPagoToken,
} from "../controllers/mercadoPagoController.js";

const router = Router();

// 📌 Ruta para guardar el token del dueño (solo una vez, con el `code`)
router.post("/token", saveMercadoPagoToken);

// 📌 Crear preferencia de pago
router.post("/preference", createOrderAndPreference);

export default router;
