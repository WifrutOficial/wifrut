import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Agregar productos al carrito
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item._id === product._id);
      if (existingProduct) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  // Eliminar productos del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Función para enviar pedido al backend
  const checkout = async () => {
    if (!user) {
      alert("Debes estar autenticado para realizar un pedido.");
      return;
    }

    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/order/create", // Asegúrate de que el endpoint es correcto
        {
          items: cart,
          total: cart.reduce((acc, item) => acc + item.precio * item.quantity, 0),
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        alert("Pedido realizado con éxito.");
        clearCart(); // Vacía el carrito después de un pedido exitoso
      }
    } catch (error) {
      console.error("Error al procesar el pedido:",error.response ? error.response.data : error);
      alert("Hubo un error al procesar tu pedido. Inténtalo nuevamente.");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};
