import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import style from "../styles/Cart.module.css";
import Swal from "sweetalert2";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [tipoVenta, setTipoVenta] = useState("");
  const { user } = useAuth();

  // Add token storage handling
  const getStoredToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };
  
  const addToCart = (product, quantity = 1) => {
    console.log("Producto a agregar al carrito:", product);
    console.log("Tipo de venta:", product.tipoVenta);
    setCart((prev) => {
      const existingProduct = prev.find((item) => item._id === product._id);
      if (existingProduct) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                tipoVenta: product.tipoVenta,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity,
            tipoVenta: product.tipoVenta,
            precio: Number(product.precio),
            precioConDescuento: isNaN(Number(product.precioConDescuento))
              ? null
              : Number(product.precioConDescuento),
          },
        ];
      }
    });
  };


  const removeFromCart = (productId) => {
    Swal.fire({
      title: "¿Seguro deseas eliminar el producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#247504",
      cancelButtonColor: "#B90003",
      customClass: {
        popup: style.customAlert,
        icon: style.customIcon,
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setCart((prevCart) =>
          prevCart.filter((item) => item._id !== productId)
        );
        Swal.fire({
          title: "Eliminado",
          text: "El producto ha sido eliminado del carrito.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            popup: style.customAlert,
            icon: style.customIconSuc,
          },
        });
      }
    });
  };


  const clearCart = () => {
    setCart([]);
  };


  const checkout = async (
    direccion,
    metodoPago,
    totalFinal,
    costoEnvio,
    turno
  ) => {
    console.log("Turno:", turno);
    console.log("Cart para enviar:", cart);
    console.log(
      "Items mapeados:",
      cart.map((item) => ({
        productId: item.productId ?? item._id,
        nombre: item.nombre,
        cantidad: item.quantity,
        precio: item.precioConDescuento ?? item.precio,
      }))
    );

    if (!user) {
      alert("Debes estar autenticado para realizar un pedido.");
      return;
    }

    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Prepare headers with Authorization if token exists
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/create`,
        {
          userId: user._id || user.id,
          items: cart.map((item) => ({
            productId: item._id,
            nombre: item.nombre,
            cantidad: item.quantity,
            precio: item.precioConDescuento ?? item.precio,
          })),
          total: totalFinal,
          costoEnvio: costoEnvio || 0,
          direccion,
          metodoPago,
          turno,
        },
        {
          withCredentials: true,
          headers
        }
      );

      if (response.status === 201) {
        return response;
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      throw error;
    }
  };


  const getTotalProductos = () => {
    return cart.reduce((acc, { quantity }) => acc + quantity, 0);
  };

  const getTotal = () => {
    return cart.reduce((acc, { quantity, precio, precioConDescuento }) => {
      const precioFinal =
        !isNaN(precioConDescuento) && precioConDescuento !== null
          ? Number(precioConDescuento)
          : Number(precio);
      const cantidad = !isNaN(quantity) ? quantity : 0;
      return acc + cantidad * precioFinal;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        getTotalProductos,
        getTotal,
        tipoVenta,
        setTipoVenta,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
