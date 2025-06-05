import { MercadoPagoConfig, Preference } from "mercadopago";
import { Order } from "../models/order.js";
import mongoose from "mongoose";

export const createOrderAndPreference = async (req, res) => {
  console.log("📩 Llamada recibida en /api/mercadopago/preference");

  const { orderId } = req.body;
  console.log("🆔 Order ID recibido:", orderId);

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("❌ ID no válido");
      return res.status(400).json({ error: "ID de orden no válido" });
    }

    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("userId");

    if (!order) {
      console.error("❌ Orden no encontrada");
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const access_token = process.env.MP_ACCESS_TOKEN;
    console.log("🔐 Token está presente:", !!access_token);
    console.log("🔐 Token comienza con:", access_token?.slice(0, 10));

    if (!access_token) {
      return res.status(500).json({ message: "Access token de Mercado Pago no configurado" });
    }

    const items = order.items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "ARS",
    }));

    const client = new MercadoPagoConfig({
      accessToken: access_token,
      options: { timeout: 5000, idempotencyKey: orderId },
    });

    const preference = new Preference(client);

    const createdPreference = await preference.create({
      body: {
        items,
        external_reference: order._id.toString(), // referencia externa para correlacionar
        back_urls: {
          success: 'https://wifrut.com/checkout/success',
          failure: 'https://wifrut.com/checkout/failure',
          pending: 'https://wifrut.com/checkout/pending',
        },
        auto_return: 'approved',
        notification_url: 'https://wifrut.com/api/mercadopago/webhook', // endpoint webhook accesible desde internet
      }
    });

    console.log("✅ Preferencia creada:", createdPreference);

    res.json({
      orderId: order._id,
      init_point: createdPreference.init_point,
    });

  } catch (error) {
    console.error("❌ Error general:", error?.response?.data || error.message || error);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
};

export const mercadoPagoWebhook = async (req, res) => {
  try {
    const payment = req.body;
    console.log("📩 Notificación webhook recibida:", payment);

    // Obtiene external_reference desde la data que Mercado Pago envía
    const external_reference = payment.external_reference || payment.data?.external_reference;

    if (!external_reference) {
      console.error("❌ No se recibió external_reference en el webhook");
      return res.status(400).send("external_reference missing");
    }

    // Ejemplo: actualizar estado de la orden según el estado del pago
    const paymentStatus = payment.status || payment.data?.status || 'pendiente';

    await Order.findByIdAndUpdate(external_reference, { paymentStatus: paymentStatus });

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).send("Error en webhook");
  }
};


