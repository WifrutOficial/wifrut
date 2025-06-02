import { Order } from "../models/order.js";
import { Product } from "../models/products.js";
import Register from "../models/register.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Genera un número de pedido tipo "20250429-001"
const generarNumeroDePedido = async () => {
  const hoy = new Date();
  const fechaStr = hoy.toISOString().slice(0, 10).replace(/-/g, ""); // "20250429"

 
  const pedidosHoy = await Order.countDocuments({
    createdAt: {
      $gte: new Date(hoy.setHours(0, 0, 0, 0)),
      $lte: new Date(hoy.setHours(23, 59, 59, 999)),
    },
  });

  const numeroSecuencia = String(pedidosHoy + 1).padStart(3, "0");
  return `${fechaStr}-${numeroSecuencia}`; 
};

export const postProduct = async (req, res) => {
  try {
    const { items, total, direccion, metodoPago, costoEnvio, turno } = req.body;
    const userId = req.user?.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }
    if (!direccion || !metodoPago) {
      return res
        .status(400)
        .json({ message: "Se requiere dirección y método de pago." });
    }
    if (!["mañana", "tarde"].includes(turno)) {
      return res.status(400).json({ message: "Turno inválido." });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Debes estar autenticado para realizar un pedido." });
    }
    const formattedItems = await Promise.all(
      items.map(async (item) => {
        const productId = item.productId ?? item._id;

        if (!productId) {
          throw new Error("El producto no tiene un ID válido.");
        }

        const product = await Product.findById(productId);
        if (!product) {
          throw new Error(`Producto con ID ${productId} no encontrado`);
        }

        const precio = product.precioConDescuento ?? product.precio;
        return {
          productId: product._id,
          nombre: product.nombre,
          cantidad: item.cantidad,
          precio,
        };
      })
    );

    const numeroPedido = await generarNumeroDePedido();

    const newOrder = new Order({
      userId,
      items: formattedItems,
      total,
      direccion,
      metodoPago,
      numeroPedido,
      costoEnvio,
      turno,
    });

    await newOrder.save();

    const usuario = await Register.findById(userId);
    const emailCliente = usuario?.email;
    if (!emailCliente) {
      console.warn("No se encontró email para el usuario:", userId);
      return res.status(201).json({
        message:
          "Pedido creado, pero no se pudo enviar el correo de confirmación.",
        order: newOrder,
      });
    }

    await sendOrderConfirmation(emailCliente, newOrder);

    res
      .status(201)
      .json({ message: "Pedido creado exitosamente", order: newOrder });
  } catch (error) {
     console.error("Error al crear el pedido:", error);
  if (error.errors) console.error(error.errors);

  // Solo una respuesta al cliente
  return res.status(500).json({ message: error.message || "Error al procesar el pedido" });
  }
};

export const sendOrderConfirmation = async (destinatarioEmail, orderData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const productosHTML = orderData.items
    .map(
      (item) => `<li>${item.cantidad} x ${item.nombre} - $${item.precio}</li>`
    )
    .join("");

  const contenidoHTML = `
     <h2>¡Gracias por elegir Wifrut!</h2>
     <p><strong>Número de pedido:</strong> ${orderData.numeroPedido}</p>
     <p>Resumen del pedido:</p>
     <ul>${productosHTML}</ul>
     <p><strong>Total:</strong> $${orderData.total}</p>
     <p>*Info:El total incluye el costo de envío y refleja automáticamente cualquier descuento aplicado si se abona en efectivo<p/> 
     <p><strong>Dirección de entrega:</strong> ${orderData.direccion}</p>
     <p><strong>Método de pago:</strong> ${orderData.metodoPago}</p>
     <p>¡Gracias por tu compra! Nos aseguraremos de que tu pedido llegue lo antes posible.</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatarioEmail,
    subject: `Confirmación de tu pedido #${orderData.numeroPedido}`,
    html: contenidoHTML,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado a", destinatarioEmail);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error; 
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};
