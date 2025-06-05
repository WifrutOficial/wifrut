import { Router } from "express";
import {
  createOrderAndPreference,
  mercadoPagoWebhook,
 
} from "../controllers/mercadoPagoController.js";

const router = Router();



router.post("/preference", createOrderAndPreference);
router.post("/webhook", mercadoPagoWebhook);

export default router;
