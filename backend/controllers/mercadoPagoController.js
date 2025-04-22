import axios from "axios";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { MercadoPagoToken } from "../models/mercadoPagoToken.js";
import { Order } from "../models/order.js";
import mongoose from "mongoose";

// Redirige al dueño para que autorice la app una vez
export const redirectToMercadoPago = (req, res) => {
  const redirect_uri = process.env.MP_REDIRECT_URI;
  const client_id = process.env.MP_CLIENT_ID;

  const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${client_id}&response_type=code&platform_id=mp&redirect_uri=${redirect_uri}`;
  res.redirect(authUrl);
};

// Callback que se ejecuta UNA SOLA VEZ cuando el dueño autoriza la app
export const mercadoPagoCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post("https://api.mercadopago.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.MP_CLIENT_ID,
      client_secret: process.env.MP_CLIENT_SECRET,
      code,
      redirect_uri: process.env.MP_REDIRECT_URI,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    const { access_token, refresh_token, expires_in, user_id } = response.data;

    console.log("✅ Access Token:", access_token);
    console.log("🔁 Refresh Token:", refresh_token);

    // 👉 Guardá access_token y refresh_token en tu base de datos o archivo seguro
    // Por ahora, simplemente redirigimos o mostramos un mensaje
    res.send("✅ Cuenta de Mercado Pago vinculada correctamente.");
  } catch (error) {
    console.error("❌ Error al obtener el token:", error?.response?.data || error);
    res.status(500).send("Error al obtener el access_token");
  }
};

// ✅ Crear orden de pago con el token guardado del dueño
export const createOrderAndPreference = async (req, res) => {
  const { orderId } = req.body;

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

    const mpToken = await MercadoPagoToken.findOne(); // asumimos que hay solo uno

    if (!mpToken || !mpToken.access_token) {
      return res.status(500).json({ message: "No hay token de Mercado Pago configurado" });
    }

    const items = order.items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "ARS",
    }));

    const client = new MercadoPagoConfig({
      accessToken: mpToken.access_token,
      options: { timeout: 5000, idempotencyKey: orderId },
    });

    const preference = new Preference(client);
    const createdPreference = await preference.create({ body: { items } });

    res.json({ orderId: order._id, init_point: createdPreference.init_point });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
};

// ✅ Este endpoint lo llamás manualmente una vez con el code y se guarda el token del dueño
export const saveMercadoPagoToken = async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post("https://api.mercadopago.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.MP_CLIENT_ID,
      client_secret: process.env.MP_CLIENT_SECRET,
      code,
      redirect_uri: process.env.MP_REDIRECT_URI,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    const { access_token, refresh_token, expires_in, user_id } = response.data;

    await MercadoPagoToken.findOneAndUpdate(
      { userId: user_id },
      {
        access_token,
        refresh_token,
        expires_in,
        obtained_at: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ message: "✅ Token guardado correctamente en la base de datos." });
  } catch (error) {
    console.error("❌ Error al guardar el token:", error?.response?.data || error);
    res.status(500).json({ message: "Error al guardar token" });
  }
};