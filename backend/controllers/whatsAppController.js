import twilio from 'twilio';
import { MongoClient } from 'mongodb';
import { Order } from '../models/order.js';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SANDBOX_NUMBER, MONGO_URI_DEV } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const mongoClient = new MongoClient(MONGO_URI_DEV);

export const getWhatsAppSend = async (req, res) => {
  const toPhoneNumber = req.query.to;
  const message = "Hola, esta es una prueba de Twilio con WhatsApp";

  if (!toPhoneNumber) {
    return res.status(400).send("El número de teléfono es requerido.");
  }

  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_SANDBOX_NUMBER}`,
      to: `whatsapp:${toPhoneNumber}`,
    });
    
    res.status(200).send(`Mensaje enviado: ${messageResponse.sid}`);
  } catch (error) {
    console.error("Error al enviar mensaje de WhatsApp:", error);
    res.status(500).send('Error al enviar el mensaje');
  }
};

export const getOrdersByDate = async (req, res) => {
  console.log("Cuerpo de la solicitud:", req.body);

  const from = req.body.From; // Número de WhatsApp que envía el mensaje
  const body = req.body.Body?.trim(); // Contenido del mensaje

  // 🔹 Validar que el usuario no sea Twilio mismo
  if (from === TWILIO_SANDBOX_NUMBER) {
    return res.status(400).send("No puedes enviarte mensajes a ti mismo desde Twilio.");
  }

  // 🔹 Validar formato del mensaje
  const dateRegex = /^pedidos\s(\d{4}-\d{2}-\d{2})$/;
  const match = body?.match(dateRegex);

  if (!match) {
    return res.status(400).send("El mensaje debe tener el formato 'pedidos YYYY-MM-DD'.");
  }

  const orderDate = new Date(match[1]);

  if (isNaN(orderDate)) {
    return res.status(400).send("La fecha proporcionada no es válida. Use el formato 'YYYY-MM-DD'.");
  }

  try {
    const startOfDay = new Date(orderDate.setHours(0, 0, 0, 0)); // Inicio del día (hora local)
    const endOfDay = new Date(orderDate.setHours(23, 59, 59, 999)); // Fin del día (hora local)
    

    console.log("Buscando pedidos entre: ", startOfDay, " y ", endOfDay);

    // 🔹 Buscar los pedidos en el rango de fechas
    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    console.log("Órdenes encontradas: ", orders);  // Asegúrate de que hay órdenes

    let responseMessage = `No se encontraron pedidos para la fecha ${match[1]}.`;

    if (orders.length > 0) {
      responseMessage = `Pedidos para la fecha ${match[1]}:\n\n`;
      orders.forEach(order => {
        responseMessage += `Pedido #${order._id} - Total: $${order.total}\n`;
      });
    }

    // 🔹 Enviar la respuesta al número que hizo la consulta
    await client.messages.create({
      body: responseMessage,
      from: TWILIO_SANDBOX_NUMBER,
      to: from,
    });

    res.status(200).send("Mensaje enviado");
  } catch (error) {
    console.error("Error al procesar la consulta:", error);
    res.status(500).send("Error al procesar la consulta");
  }
};

export const getOrdersByDate2 = async (req, res) => {
  try {
    const { date } = req.query; 
    if (!date) {
      return res.status(400).json({ message: "Se requiere una fecha válida" });
    }

    
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    console.log("Buscando pedidos entre:", startDate, "y", endDate);

//populate para unir la informacion de dos modelos
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate("userId", "phone");

  

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

