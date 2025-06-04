import { Router } from "express";
import {
  createOrderAndPreference,
  saveMercadoPagoToken,
    mercadoPagoCallback, 
} from "../controllers/mercadoPagoController.js";

const router = Router();


router.post("/token", saveMercadoPagoToken);

router.post("/preference", createOrderAndPreference);
// 👇 AGREGAR ESTA RUTA
router.get("/auth/mp/callback", mercadoPagoCallback);

export default router;
