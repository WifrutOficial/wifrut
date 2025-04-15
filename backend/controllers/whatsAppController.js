import twilio from "twilio";
import mongoose from "mongoose";
import { Order } from "../models/order.js";



// 🔹 Configuración de Twilio
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, MONGO_URI_DEV } = process.env;
const TWILIO_SANDBOX_NUMBER = "whatsapp:+14155238886"; // Número de pruebas de Twilio

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// 🔹 Conectar a MongoDB una sola vez
mongoose
  .connect(MONGO_URI_DEV)
  .then(() => console.log("✅ Conectado a MongoDB 🚀"))
  .catch((err) => console.error("❌ Error al conectar con MongoDB:", err));

// 🔹 Función para enviar mensajes de WhatsApp
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

// 🔹 Enviar mensaje de prueba por WhatsApp
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

// 🔹 Buscar pedidos por fecha y responder en WhatsApp
export const getOrdersByDate = async (req, res) => {
  const from = req.body.From; // Número de WhatsApp del usuario
  const body = req.body.Body?.trim(); // Mensaje recibido

  console.log("📩 Mensaje recibido:", { from, body });

  // Validación de formato "pedidos YYYY-MM-DD"
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

    // Buscar pedidos en la base de datos
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

    // Responder al usuario por WhatsApp
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
  const from = req.body.From; // Número de WhatsApp del usuario
  const body = req.body.Body?.trim(); // Mensaje recibido

  console.log("📩 Mensaje recibido:", { from, body });

  // Validación de formato "total productos YYYY-MM-DD"
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

    // Buscar todos los pedidos en la fecha dada
    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    // Crear un objeto para almacenar la suma total por producto
    const productTotals = {};

    // Recorrer todos los pedidos y productos
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productName = item.nombre.toLowerCase(); // Nombre del producto
        const productQuantity = item.cantidad; // Cantidad del producto

        // Si el producto ya existe en el objeto, sumar la cantidad
        if (productTotals[productName]) {
          productTotals[productName] += productQuantity;
        } else {
          // Si es la primera vez que aparece el producto, inicializar su cantidad
          productTotals[productName] = productQuantity;
        }
      });
    });

    // Crear un mensaje con los resultados
    let responseMessage = `📅 Total de productos vendidos el ${match[1]}:\n\n`;

    // Verificar si hay productos en total
    if (Object.keys(productTotals).length === 0) {
      responseMessage = `📅 No se encontraron pedidos para ${match[1]}.`;
    } else {
      // Mostrar el total de cada producto
      for (let productName in productTotals) {
        responseMessage += `🛒 ${productName.charAt(0).toUpperCase() + productName.slice(1)}: ${productTotals[productName]} unidades\n`;
      }
    }

    // Responder al usuario por WhatsApp
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


// 🔹 Verificar el webhook de Twilio
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

    console.log("🕵️ Buscando pedidos entre:", startDate, "y", endDate);
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: 'userId',    // Referencia al campo `userId` en el modelo `Order`, que debe hacer populate con el modelo `Register`.
        select: 'phone',   // Solo traer el campo `phone` del modelo `Register`.
      })
      .populate({
        path: 'items.productId',  // Hacer el populate sobre el campo `productId` dentro de `items`.
        select: 'nombre tipoVenta',  // Solo traer los campos `nombre` y `tipoVenta` del modelo `Product`.
      });
    
      console.log(JSON.stringify(orders, null, 2));
    

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos (web):", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};