import { Order } from "../models/order.js";
import mongoose from "mongoose";
import { MercadoPagoConfig, Preference } from "mercadopago"; // ⚠️ Asegurate de tener esto importado

export const createOrderAndPreference = async (req, res) => {
  const { orderId } = req.body;

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

    if (!access_token) {
      return res.status(500).json({ message: "Access token de Mercado Pago no configurado" });
    }

    const items = [
      {
        title: `Compra en WiFrut - Pedido ${order.numeroPedido}`,
        quantity: 1,
        unit_price: Number(order.total),
        currency_id: "ARS",
      }
    ];

    const orderDetails = order.items.map(item => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
      subtotal: item.cantidad * item.precio,
    }));

    const client = new MercadoPagoConfig({
      accessToken: access_token,
      options: { timeout: 5000, idempotencyKey: orderId },
    });

    const preference = new Preference(client);

    const createdPreference = await preference.create({
      body: {
        items,
        external_reference: order._id.toString(),
        back_urls: {
          success: 'https://wifrut.com/checkout/success',
          failure: 'https://wifrut.com/checkout/failure',
          pending: 'https://wifrut.com/checkout/pending',
        },
        auto_return: 'approved',
        notification_url: 'https://wifrut.com/api/mercadopago/webhook',
        metadata: {
          numeroPedido: order.numeroPedido,
          userId: order.userId._id.toString(),
          productos: orderDetails,
          total: order.total,
          direccion: order.direccion,
          turno: order.turno,
        }
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

    const external_reference = payment.external_reference || payment.data?.external_reference;

    if (!external_reference) {
      return res.status(400).send("external_reference missing");
    }

    const paymentStatus = payment.status || payment.data?.status || 'pendiente';

    // 🟢 Cambiamos la lógica para buscar la orden y actualizar también el estado si fue aprobado
    const order = await Order.findById(external_reference);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    order.paymentStatus = paymentStatus;

    // ✅ Si el pago fue aprobado, actualizamos también el estado del pedido
    if (paymentStatus === 'approved') {
      order.estado = 'Confirmado'; // 📝 Usá el estado que manejes en tu panel ('Pagado', 'Entregado', etc.)
    }

    await order.save();

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).send("Error en webhook");
  }
};
