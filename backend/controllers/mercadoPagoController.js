import mercadopago from "mercadopago";
import { Order } from "../models/order.js";
import mongoose from "mongoose";

export const createOrderAndPreference = async (req, res) => {
  const { orderId } = req.body;

  console.log("orderId recibido:", orderId);

  try {
    // Validar que orderId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "ID de orden no válido" });
    }

    // Buscar la orden en la base de datos
    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("userId");

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Crear los items de la preferencia de Mercado Pago
    const items = order.items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "ARS",
    }));

    // Configurar Mercado Pago con el token de acceso
    mercadopago.configurations.setAccessToken("YOUR_ACCESS_TOKEN");

    // Crear la preferencia de pago
    const preference = {
      items,
      payer: {
        name: order.userId.name,
        email: order.userId.email,
      },
      back_urls: {
        success: "https://www.mercadopago.com.ar/success",
        failure: "https://www.mercadopago.com.ar/failure",
        pending: "https://www.mercadopago.com.ar/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    // Guarda el id de la preferencia en la orden
    order.preferenceId = response.body.id;
    await order.save();

    // Enviar la URL de pago al frontend
    res.json({ sandbox_init_point: response.body.sandbox_init_point });
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
};



