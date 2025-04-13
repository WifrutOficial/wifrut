import { Router } from "express";
import {
  getWhatsAppSend,
  getOrdersByDate,
  verifyTwilioWebhook,
  getTotalProductsByDate,
  sendWhatsAppMessage,
  getOrdersByDateWeb

} from "../controllers/whatsAppController.js";




const router = Router();

// Ruta para enviar mensajes de prueba (GET)
router.get("/send-whatsapp", getWhatsAppSend);

// Ruta para la verificación de Twilio (GET)
router.get("/webhook", verifyTwilioWebhook);

// Ruta para manejar todos los mensajes de WhatsApp y redirigir según el contenido (POST)
router.post("/webhook", async (req, res) => {
  const body = req.body.Body?.trim();

  // Validar si es un mensaje de tipo 'pedidos YYYY-MM-DD'
  const ordersDateRegex = /^pedidos\s(\d{4}-\d{2}-\d{2})$/;
  const matchOrders = body?.match(ordersDateRegex);
  if (matchOrders) {
    return getOrdersByDate(req, res); // Redirigir a la función que obtiene los pedidos por fecha
  }

  // Validar si es un mensaje de tipo 'total productos YYYY-MM-DD'
  const totalProductsRegex = /^total\sproductos\s(\d{4}-\d{2}-\d{2})$/;
  const matchTotalProducts = body?.match(totalProductsRegex);
  if (matchTotalProducts) {
    return getTotalProductsByDate(req, res); // Redirigir a la función que obtiene el total de productos vendidos por fecha
  }

  // Si el formato no coincide con ninguno, enviar mensaje de error
  await sendWhatsAppMessage(req.body.From, "⚠️ Formato desconocido. Usa 'pedidos YYYY-MM-DD' o 'total productos YYYY-MM-DD'.");
  res.status(400).send("Formato desconocido");
});
router.get("/ordersByDate", getOrdersByDateWeb);

export default router;
