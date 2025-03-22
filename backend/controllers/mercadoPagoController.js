import { MercadoPagoConfig, Preference } from "mercadopago";
import { Order } from "../models/order.js";
import mongoose from "mongoose";


export const createOrderAndPreference = async (req, res) => {
  const { orderId } = req.body;

  console.log("orderId recibido:", orderId);

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "ID de orden no válido" });
    }

    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("userId");

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const items = order.items.map((item) => ({
      id: item.productId._id, 
      id: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "ARS",
    }));
    const idempotencyKey = orderId; 
    const client = new MercadoPagoConfig({
      accessToken:
        "APP_USR-8199887439890075-031921-26cd2269d40b72749f9cbd3d2491290f-2338185913",
      options: { timeout: 5000, idempotencyKey },
    });

    const preference = new Preference(client);

    const createdPreference = await preference.create({
      body: {
        items,
      },
    });

    res.json({ orderId: order._id, init_point: createdPreference.init_point });
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
};
