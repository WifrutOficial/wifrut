import {Order} from "../models/order.js"


export const postProduct = async (req, res) => {
    try {
      console.log("Pedido recibido:", req.body); // 🔥 Verifica qué datos llegan
        const { items, total } = req.body;
        const userId = req.user.id; // El ID del usuario autenticado
    
        if (!items || items.length === 0) {
          return res.status(400).json({ message: "El carrito está vacío." });
        }
    
        const newOrder = new Order({
          userId,
          items,
          total,
        });
    
        await newOrder.save();
        res.status(201).json({ message: "Pedido creado exitosamente", order: newOrder });
    
      } catch (error) {
        console.error("Error al crear el pedido:", error);
        res.status(500).json({ message: "Error al procesar el pedido" });
      }
};