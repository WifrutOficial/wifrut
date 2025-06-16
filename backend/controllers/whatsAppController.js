import twilio from "twilio";
import { Order } from "../models/order.js";

const { 
  TWILIO_ACCOUNT_SID, 
  TWILIO_AUTH_TOKEN,
  TWILIO_PROD_NUMBER,
  OWNER_PHONE_NUMBERS
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const authorizedNumbers = OWNER_PHONE_NUMBERS ? OWNER_PHONE_NUMBERS.split(',') : [];

// --- FUNCIONES EXPORTADAS PARA EL ROUTER ---

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const msg = await client.messages.create({
      body: message,
      from: TWILIO_PROD_NUMBER,
      to: to,
    });
    console.log(`📩 Mensaje enviado a ${to}:`, msg.sid);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar mensaje de WhatsApp:", error);
    return false;
  }
};

export const handleWhatsAppWebhook = async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body?.trim().toLowerCase();

  if (!authorizedNumbers.includes(from)) {
    console.warn(`⚠️ Intento de acceso no autorizado desde ${from}`);
    return res.status(200).send("OK");
  }

  try {
    if (body.startsWith("pedidos")) {
      await handleGetOrders(from, body);
    } else if (body.startsWith("total productos")) {
      await handleGetTotalProducts(from, body);
    } else {
      await sendWhatsAppMessage(
        from,
        "👋 ¡Hola! Comandos disponibles:\n\n1️⃣ `pedidos AAAA-MM-DD`\n2️⃣ `total productos AAAA-MM-DD`"
      );
    }
    res.status(200).send("✅ Petición procesada");
  } catch (error) {
    console.error("❌ Error procesando el webhook:", error);
    await sendWhatsAppMessage(from, "🤖 Ups, ocurrió un error en el servidor.");
    res.status(500).send("Error interno");
  }
};


export const verifyTwilioWebhook = (req, res) => {
  const twilioChallenge = req.query['hub.challenge'];
  if (twilioChallenge) {
    console.log("✅ Webhook de Twilio verificado.");
    res.status(200).send(twilioChallenge);
  } else {
    console.error("❌ Falló la verificación del webhook de Twilio.");
    res.status(400).send("Error: Desafío no encontrado.");
  }
};

// ==> FUNCIÓN AÑADIDA PARA TU RUTA DE PRUEBA <==
export const getWhatsAppSend = async (req, res) => {
  const toPhoneNumber = req.query.to;
  if (!toPhoneNumber) {
    return res.status(400).send("❌ Debes proporcionar un número de WhatsApp en la query string (?to=whatsapp:+549...).");
  }

  const message = `👋 Hola! Este es un mensaje de prueba enviado hoy, ${new Date().toLocaleDateString('es-AR')}.`;
  const success = await sendWhatsAppMessage(`whatsapp:${toPhoneNumber}`, message);

  if (success) {
    res.status(200).send(`✅ Mensaje de prueba enviado a ${toPhoneNumber}`);
  } else {
    res.status(500).send("❌ Error al enviar el mensaje de prueba.");
  }
};

export const getOrdersByDateWeb = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Se requiere una fecha válida" });

    const startDate = new Date(`${date}T00:00:00.000-03:00`); 
    const endDate = new Date(`${date}T23:59:59.999-03:00`);


const orders = await Order.find({ createdAt: { $gte: startDate, $lte: endDate } })
    .populate('userId', 'telefono')
    .sort({ createdAt: -1 });


    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos (web):", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

// --- FUNCIONES INTERNAS (NO SE EXPORTAN) ---

const handleGetOrders = async (from, body) => {
  const match = body.match(/^pedidos\s(\d{4}-\d{2}-\d{2})$/);
  if (!match) {
    await sendWhatsAppMessage(from, "⚠️ Formato incorrecto. Usa: 'pedidos AAAA-MM-DD'.");
    return;
  }
  
  const dateStr = match[1];
  const startOfDay = new Date(`${dateStr}T00:00:00.000-03:00`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999-03:00`);

  if (isNaN(startOfDay.getTime())) {
    await sendWhatsAppMessage(from, "⚠️ Fecha inválida.");
    return;
  }

  const orders = await Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).populate("userId", "phone metodoPago");
  
  let responseMessage = `📅 No hay pedidos para ${dateStr}.`;
  if (orders.length > 0) {
    responseMessage = `📦 Pedidos del ${dateStr}:\n`;
    orders.forEach((order, index) => {
      responseMessage += `\n*${index + 1}.* Total: $${order.total}\nDireccion: ${order.direccion}\nTelefono: ${order.userId.phone}\nPago: ${order.metodoPago || 'N/A'}\nTurno: ${order.turno}\n`;
    });
  }
  await sendWhatsAppMessage(from, responseMessage);
};

const handleGetTotalProducts = async (from, body) => {
  const match = body.match(/^total\sproductos\s(\d{4}-\d{2}-\d{2})$/);
  if (!match) {
    await sendWhatsAppMessage(from, "⚠️ Formato incorrecto. Usa: 'total productos AAAA-MM-DD'.");
    return;
  }
  
  const dateStr = match[1];
  const startOfDay = new Date(`${dateStr}T00:00:00.000-03:00`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999-03:00`);

  if (isNaN(startOfDay.getTime())) {
    await sendWhatsAppMessage(from, "⚠️ Fecha inválida.");
    return;
  }

  const productTotals = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
    { $unwind: "$items" },
    { $group: {
        _id: { $toLower: "$items.nombre" },
        totalQuantity: { $sum: "$items.cantidad" }
    }},
    { $sort: { _id: 1 } }
  ]);

  if (productTotals.length === 0) {
    await sendWhatsAppMessage(from, `📅 No se vendió ningún producto el ${dateStr}.`);
    return;
  }
  
  let responseMessage = `📊 Total de productos vendidos el ${dateStr}:\n\n`;
  productTotals.forEach(product => {
    const productName = product._id.charAt(0).toUpperCase() + product._id.slice(1);
    responseMessage += `🛒 *${productName}*: ${product.totalQuantity} unidades\n`;
  });

  await sendWhatsAppMessage(from, responseMessage);
};