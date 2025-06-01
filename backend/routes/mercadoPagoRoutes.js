import { Router } from "express";
import {
  createOrderAndPreference,
  saveMercadoPagoToken,
} from "../controllers/mercadoPagoController.js";

const router = Router();


router.post("/token", saveMercadoPagoToken);

router.post("/preference", createOrderAndPreference);

export default router;
