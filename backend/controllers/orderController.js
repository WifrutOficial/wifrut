import { Order } from "../models/order.js";
import { Product } from "../models/products.js";
import Register from "../models/register.js";
import nodemailer from "nodemailer";
import Pedido from "../models/repeticionOrder.js";
import dotenv from "dotenv";
dotenv.config();




// Controlador para crear un nuevo pedido basado en uno existente
export const createNewOrder = async (req, res) => {
  try {
    const { productos, total, direccion, metodoPago } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }
    if (!direccion || !metodoPago) {
      return res
        .status(400)
        .json({ message: "Se requiere dirección y método de pago." });
    }

    // Generar número de pedido (esto puede ser adaptado según tu lógica de negocio)
    const numeroPedido = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Crear un nuevo pedido utilizando el modelo Pedido
    const nuevoPedido = new Pedido({
      numeroPedido,
      usuarioId: req.user.id,  // Asegúrate de usar el usuario autenticado
      productos,
      total,
      direccion,
      metodoPago,
    });

    // Guardar el pedido en la base de datos
    await nuevoPedido.save();

    // Devolver la respuesta con el pedido creado
    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error("Error al crear el nuevo pedido:", error);
    res.status(500).json({ error: 'Hubo un error al crear el nuevo pedido' });
  }
};



// Genera un número de pedido tipo "20250429-001"
const generarNumeroDePedido = async () => {
  const hoy = new Date();
  const fechaStr = hoy.toISOString().slice(0, 10).replace(/-/g, ""); // "20250429"

  // Contar pedidos ya realizados hoy
  const pedidosHoy = await Order.countDocuments({
    createdAt: {
      $gte: new Date(hoy.setHours(0, 0, 0, 0)),
      $lte: new Date(hoy.setHours(23, 59, 59, 999)),
    },
  });

  const numeroSecuencia = String(pedidosHoy + 1).padStart(3, "0");
  return `${fechaStr}-${numeroSecuencia}`; // Corregido
};

// Controlador principal
export const postProduct = async (req, res) => {
  try {
    const { items, total, direccion, metodoPago, costoEnvio } = req.body;
    const userId = req.user?.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }
    if (!direccion || !metodoPago) {
      return res
        .status(400)
        .json({ message: "Se requiere dirección y método de pago." });
    }
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Debes estar autenticado para realizar un pedido." });
    }

    const formattedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
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
      costoEnvio, // Añadido si el modelo Order lo soporta
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
    res.status(500).json({ message: "Error al procesar el pedido" });
    if (error.errors) console.error(error.errors);
res.status(500).json({ message: error.message });
  }
};

// Envío de correo actualizado con número de pedido
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
    throw error; // Opcional: manejar en el controlador
  }
};


