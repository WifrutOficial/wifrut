import { Router } from "express";
import {
  getWhatsAppSend,
  getOrdersByDate,
  getOrdersByDate2,
} from "../controllers/whatsAppController.js";

const router = Router();

// Ruta para enviar mensajes
router.get("/send-whatsapp", getWhatsAppSend);

// Ruta para buscar pedidos por fecha
router.post("/webhook", getOrdersByDate);

// Ruta para buscar pedidos por fecha
router.get("/ordersByDate", getOrdersByDate2);

export default router;
