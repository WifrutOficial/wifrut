import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Cart.module.css";
import { IoTrashOutline } from "react-icons/io5";     
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { IoIosArrowDropleft } from "react-icons/io";
import Swal from "sweetalert2";


export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, checkout, getTotal } = useCart();
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  const total = getTotal();
  const costoEnvio = 2800;
  const totalFinal = total + costoEnvio;

  const handlePagoChange = (metodo) => setMetodoPago(metodo);

  const handleCheckout = async () => {
  
    if (!direccion.trim()) {
      Swal.fire({
        title: "¡Error!",
        text: "Por favor ingresa una dirección de envío.",
        icon: "warning",
        confirmButtonColor: "#B90003",
        customClass: {
          popup: style.customAlert, 
          icon: style.customIcon 
        }
      
      });
      return;
    }
    if (!metodoPago) {
      Swal.fire({
        title: "¡Error!",
        text: "Por favor seleccione un metodo de pago.",
        icon: "warning",
        confirmButtonColor: "#B90003",
        customClass: {
          popup: style.customAlert, 
          icon: style.customIcon 
        }
      
      });
      return;
    }
  
    try {
      const response = await checkout(direccion, metodoPago);
      console.log("Respuesta del checkout:", response);
  
      if (response && response.status === 201) {
        alert("Pedido realizado con éxito.");
        clearCart();
  
        // Extraer el orderId correctamente
        const orderId = response.data.order?._id;  
        if (!orderId) {
          console.error("Error: orderId no encontrado en la respuesta del checkout.");
          return;
        }
  
        if (metodoPago === "Mercado Pago") {
          createMercadoPagoPreference(orderId);
        }
      } else {
        alert("Hubo un error al procesar tu pedido. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      alert("Hubo un error al procesar tu pedido. Inténtalo nuevamente.");
    }
  };
  
  const createMercadoPagoPreference = async (orderId) => {
    if (!orderId) {
      console.error("El orderId es inválido o no se ha proporcionado.");
      return;
    }
    console.log("orderId que se está enviando:", orderId);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mercadopago/preference`, 
        { orderId }
      );
  
      console.log("Respuesta de Mercado Pago:", response.data);
  
      if (response.data.init_point) {
        window.location.href = response.data.init_point; // Redirige al pago
      } else {
        alert("Hubo un error al generar la preferencia de pago. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al crear la preferencia de pago:", error);
      alert("Hubo un error al procesar el pago. Inténtalo nuevamente.");
    }
  };
  
  

  return (
    <div className={style.container}>
     
      <h2 className={style.title}>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div className={style.containerCart}>
           <IoIosArrowDropleft className={style.arrow} onClick={() => navigate("/")} />
          <ul className={style.cart}>
            {cart.map(({ _id, nombre, precio, quantity, precioConDescuento, tipoVenta }) => {
              const precioFinal = precioConDescuento ?? precio;
              return (
                <li key={_id} className={style.cartItem}>
                  <p>{nombre}</p>
                  <div className={style.cantidades}>
                    <p>{quantity} {tipoVenta === "kg" ? "kg" : "U"}</p>
                  </div>
                  <p>Total: ${quantity * precioFinal}</p>
                  <button onClick={() => removeFromCart(_id)} aria-label={`Eliminar ${nombre} del carrito`} className={style.btnDelete}>
                    <IoTrashOutline />
                  </button>
                </li>
              );
            })}
          </ul>
          <hr />
          <div className={style.total}>
            <p>Total: ${total.toFixed(2)}</p>
          </div>
          <div className={style.envio}>
            <div className={style.inputEnvio}>
              <p>Dirección de envío:</p>
              <input
                type="text"
                placeholder="Escribe tu dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
            <p>Costo: ${costoEnvio}</p>
          </div>
          <p className={style.fullTotal}>Total Final: ${totalFinal.toFixed(2)}</p>
          <div>
            <p className={style.titlePago}>Método de pago</p>
            <div className={style.containerPago}>
              {["Efectivo", "Mercado Pago"].map((metodo) => (
                <label key={metodo} className={style.containerPagoInput}>
                  {metodo}
                  <input
                    type="radio"
                    name="metodoPago"
                    checked={metodoPago === metodo}
                    onChange={() => handlePagoChange(metodo)}
                  />
                </label>
              ))}
            </div>
          </div>
          {cart.length > 0 && (
            <div className={style.btnContainer}>
              <button onClick={() => window.confirm("¿Estás seguro de vaciar el carrito?") && clearCart()}>
                Vaciar Carrito
              </button>
              <button onClick={handleCheckout}>Realizar Pedido</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
