import twilio from "twilio";
import mongoose from "mongoose";
import { Order } from "../models/order.js";




const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, MONGO_URI_DEV } = process.env;
const TWILIO_SANDBOX_NUMBER = "whatsapp:+14155238886"; // Número de pruebas de Twilio

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);



export const sendWhatsAppMessage = async (to, message) => {
  try {
    const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

    const msg = await client.messages.create({
      body: message,
      from: TWILIO_SANDBOX_NUMBER,
      to: formattedTo,
    });

    console.log(`📩 Mensaje enviado a ${formattedTo}:`, msg.sid);
    return true;
  } catch (error) {
    console.error("❌ Error al enviar mensaje de WhatsApp:", error);
    return false;
  }
};


export const getWhatsAppSend = async (req, res) => {
  const toPhoneNumber = req.query.to;
  if (!toPhoneNumber) {
    return res.status(400).send("❌ Debes proporcionar un número de WhatsApp.");
  }

  const message =
    "👋 Hola! Este es un mensaje de prueba de Twilio con WhatsApp.";
  const success = await sendWhatsAppMessage(toPhoneNumber, message);

  if (success) {
    res.status(200).send(`✅ Mensaje enviado a ${toPhoneNumber}`);
  } else {
    res.status(500).send("❌ Error al enviar el mensaje.");
  }
};


export const getOrdersByDate = async (req, res) => {
  const from = req.body.From; // Número de WhatsApp del usuario
  const body = req.body.Body?.trim(); // Mensaje recibido

  console.log("📩 Mensaje recibido:", { from, body });

 
  const dateRegex = /^pedidos\s(\d{4}-\d{2}-\d{2})$/;
  const match = body?.match(dateRegex);

  if (!match) {
    await sendWhatsAppMessage(
      from,
      "⚠️ Formato incorrecto. Usa: 'pedidos YYYY-MM-DD'."
    );
    return res.status(400).send("Formato incorrecto");
  }

  const orderDate = new Date(match[1]);
  if (isNaN(orderDate)) {
    await sendWhatsAppMessage(
      from,
      "⚠️ Fecha inválida. Usa el formato 'YYYY-MM-DD'."
    );
    return res.status(400).send("Fecha inválida");
  }

  try {
    const startOfDay = new Date(orderDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(orderDate);
    endOfDay.setHours(23, 59, 59, 999);

   
    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    }).populate("userId", "telefono");

    let responseMessage = `📅 No hay pedidos para ${match[1]}.`;

    if (orders.length > 0) {
      responseMessage = `📦 Pedidos del ${match[1]}:\n\n`;
      orders.forEach((order) => {
        responseMessage += `🛒 Pedido  - Total: $${order.total} - Dirección: ${order.direccion} - Estado: ${order.status} - Teléfono: ${order.userId.telefono} - Metodo de Pago: ${order.userId.metodoPago} \n `;
      });
    }


    await sendWhatsAppMessage(from, responseMessage);
    res.status(200).send("✅ Consulta procesada");
  } catch (error) {
    console.error("❌ Error en la consulta:", error);
    await sendWhatsAppMessage(
      from,
      "⚠️ Error en el servidor. Inténtalo más tarde."
    );
    res.status(500).send("Error en el servidor");
  }
};

export const getTotalProductsByDate = async (req, res) => {
  const from = req.body.From; 
  const body = req.body.Body?.trim(); 




  const dateRegex = /^total\sproductos\s(\d{4}-\d{2}-\d{2})$/;
  const match = body?.match(dateRegex);

  if (!match) {
    await sendWhatsAppMessage(
      from,
      "⚠️ Formato incorrecto. Usa: 'total productos YYYY-MM-DD'."
    );
    return res.status(400).send("Formato incorrecto");
  }

  const orderDate = new Date(match[1]);
  if (isNaN(orderDate)) {
    await sendWhatsAppMessage(
      from,
      "⚠️ Fecha inválida. Usa el formato 'YYYY-MM-DD'."
    );
    return res.status(400).send("Fecha inválida");
  }

  try {
    const startOfDay = new Date(orderDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(orderDate);
    endOfDay.setHours(23, 59, 59, 999);

  
    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

 
    const productTotals = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productName = item.nombre.toLowerCase(); 
        const productQuantity = item.cantidad; 

       
        if (productTotals[productName]) {
          productTotals[productName] += productQuantity;
        } else {
         
          productTotals[productName] = productQuantity;
        }
      });
    });


    let responseMessage = `📅 Total de productos vendidos el ${match[1]}:\n\n`;

    if (Object.keys(productTotals).length === 0) {
      responseMessage = `📅 No se encontraron pedidos para ${match[1]}.`;
    } else {
 
      for (let productName in productTotals) {
        responseMessage += `🛒 ${productName.charAt(0).toUpperCase() + productName.slice(1)}: ${productTotals[productName]} unidades\n`;
      }
    }

 
    await sendWhatsAppMessage(from, responseMessage);
    res.status(200).send(" Consulta procesada");
  } catch (error) {
    console.error("❌ Error en la consulta:", error);
    await sendWhatsAppMessage(
      from,
      " Error en el servidor. Inténtalo más tarde."
    );
    res.status(500).send("Error en el servidor");
  }
};


export const verifyTwilioWebhook = (req, res) => {
  const challenge = req.query["hub.challenge"];
  if (challenge) {
    return res.status(200).send(challenge);
  }
  return res.status(400).send("Desafío no encontrado");
};

// Para el frontend de la web
export const getOrdersByDateWeb = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Se requiere una fecha válida" });
    }

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

   
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: 'userId',    
        select: 'phone',   
      })
      .populate({
        path: 'items.productId',  
        select: 'nombre tipoVenta',  
      });
    
 
    

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos (web):", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};