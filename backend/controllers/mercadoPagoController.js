import { MercadoPagoConfig, Preference } from 'mercadopago';
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
      id: item.nombre,
      id: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: "ARS",
    }));

    // Configurar Mercado Pago con el token de acceso
    // mercadopago.configurations.setAccessToken("YOUR_ACCESS_TOKEN");
    // Step 2: Initialize the client object
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAOG, options: { timeout: 5000, idempotencyKey: item.nombre } });

    const preference = new Preference(client);

    const createdPreference = await preference.create({
      body: {
        items,
      }
    });

    res.json({ init_point: createdPreference.init_point });

    // return createdPreference.init_point;


    // Step 3: Initialize the API object
    // const payment = new Payment(client);

    // Crear la preferencia de pago
    // const preference = {
    //   items,
    //   payer: {
    //     name: order.userId.name,
    //     email: order.userId.email,
    //   },
    //   back_urls: {
    //     success: "https://www.mercadopago.com.ar/success",
    //     failure: "https://www.mercadopago.com.ar/failure",
    //     pending: "https://www.mercadopago.com.ar/pending",
    //   },
    //   auto_return: "approved",
    // };

    // Step 4: Create the request object
    // const priceQuantity = items?.reduce((acc, item) => {
    //   acc + item.unit_price;
    // }, 0);

    // const body = {
    //   transaction_amount: priceQuantity,
    //   description: order.userId.name,
    //   payment_method_id: '<PAYMENT_METHOD_ID>',
    //   payer: {
    //     email: '<EMAIL>'
    //   },
    // };

    // // Step 5: Create request options object - Optional
    // const requestOptions = {
    //   idempotencyKey: '<IDEMPOTENCY_KEY>',
    // };

    // // Step 6: Make the request
    // payment.create({ body, requestOptions }).then(console.log).catch(console.log);

    // const response = await mercadopago.preferences.create(preference);

    // Guarda el id de la preferencia en la orden
    // order.preferenceId = response.body.id;
    // await order.save();

    // Enviar la URL de pago al frontend
    // res.json({ sandbox_init_point: response.body.sandbox_init_point });
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
};



