import { Router } from "express";
import twilio from "twilio";
import {
  getWhatsAppSend,
  handleWhatsAppWebhook,
  verifyTwilioWebhook,
  getOrdersByDateWeb
} from "../controllers/whatsAppController.js";

const router = Router();

const twilioWebhookValidator = twilio.webhook({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN
});


router.get("/send-whatsapp", getWhatsAppSend);
router.get("/ordersByDate", getOrdersByDateWeb);

// --- RUTAS DE WEBHOOK DE TWILIO ---

// Twilio usa esta ruta con GET para verificar la URL
router.get("/webhook", verifyTwilioWebhook);
router.post("/webhook", twilioWebhookValidator, handleWhatsAppWebhook);

export default router;