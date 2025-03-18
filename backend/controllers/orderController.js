import {Order} from "../models/order.js"
import { Product } from "../models/products.js";

export const postProduct = async (req, res) => {
  try {
    console.log("Pedido recibido:", req.body);

    const { items, total,direccion, metodoPago } = req.body;
    const userId = req.user?.userId;
 

    // Verificar que el carrito no esté vacío
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

     // Verificar que se haya proporcionado una dirección y un método de pago
     if (!direccion || !metodoPago) {
      return res.status(400).json({ message: "Se requiere dirección y método de pago." });
    }

    // Formatear los items del carrito
    const formattedItems = await Promise.all(
      items.map(async (item) => {
        // Buscar el producto en la base de datos usando el productId
        const product = await Product.findById(item.productId);
        
        // Asegurarse de que el producto existe
        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        // Usar el precio con descuento si existe
        const precio = product.precioConDescuento ?? product.precio;

        return {
          productId: product._id,
          nombre: product.nombre,
          cantidad: item.cantidad,
          precio,
          direccion, 
          metodoPago
        };
      })
    );

    // Crear el pedido con los datos recibidos
    const newOrder = new Order({
      userId,
      items: formattedItems,
      total,
      direccion,
      metodoPago
    });

    // Guardar el pedido en la base de datos
    await newOrder.save();

    res.status(201).json({ message: "Pedido creado exitosamente", order: newOrder });

  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({ message: "Error al procesar el pedido" });
  }
};
