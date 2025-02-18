import React from "react";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Cart.module.css"

export default function Cart() {
  const { cart, removeFromCart, clearCart, checkout } = useCart();

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {cart.map(({ _id, nombre, precio, quantity }) => (
            <li key={_id}>
              <p>{nombre}</p>
              <p>Cantidad: {quantity}</p>
              <p>Total: ${quantity * precio}</p>
              <button onClick={() => removeFromCart(_id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <>
          <button
            onClick={() => {
              if (window.confirm("¿Estás seguro de vaciar el carrito?")) {
                clearCart();
              }
            }}
          >
            Vaciar Carrito
          </button>
          <button onClick={checkout}>Realizar Pedido</button>
        </>
      )}
    </div>
  );
}
