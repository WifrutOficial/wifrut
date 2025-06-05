import { MercadoPagoConfig, Preference } from "mercadopago";
import { Order } from "../models/order.js";
import mongoose from "mongoose";

export const createOrderAndPreference = async (req, res) => {
  const { orderId } = req.body;

  console.log("📦 Iniciando creación de preferencia con orderId:", orderId);

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("❌ orderId inválido:", orderId);
      return res.status(400).json({ error: "ID de orden no válido" });
    }

    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("userId");

    if (!order) {
      console.error("❌ Orden no encontrada con ID:", orderId);
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    console.log("✅ Orden encontrada:", order._id);
    console.log("🛒 Items de la orden:", order.items);
    console.log("👤 Usuario:", order.userId?.email || "Sin email");

    const access_token = process.env.MP_ACCESS_TOKEN;

    if (!access_token) {
      console.error("❌ Access token de Mercado Pago no está configurado");
      return res.status(500).json({ message: "Access token no configurado" });
    }

    const items = order.items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "ARS",
    }));

    console.log("🧾 Items para MP:", items);

    const client = new MercadoPagoConfig({
      accessToken: access_token,
      options: { timeout: 5000, idempotencyKey: orderId },
    });

    const preference = new Preference(client);

    const preferenceData = {
      body: {
        items,
        back_urls: {
          success: 'https://wifrut.com/checkout/success',
          failure: 'https://wifrut.com/checkout/failure',
          pending: 'https://wifrut.com/checkout/pending',
        },
        auto_return: 'approved',
      }
    };

    console.log("📨 Enviando preferencia a MP:", preferenceData);

    const createdPreference = await preference.create(preferenceData);

    console.log("✅ Preferencia creada:", createdPreference.id || createdPreference);

    res.json({
      orderId: order._id,
      init_point: createdPreference.init_point,
    });

  } catch (error) {
    console.error("❌ Error al crear preferencia:", error.response?.data || error.message || error);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
};
