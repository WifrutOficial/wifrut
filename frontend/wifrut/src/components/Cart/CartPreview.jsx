import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import style from "../../styles/CartPrewie.module.css";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function CartPreview() {
  const { cart } = useCart();
  const [open, setOpen] = useState(true);
  const cartRef = useRef(null);
    const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  // Calcular total
  const total = cart.reduce((acc, item) => {
    const precio = item.precioConDescuento ?? item.precio;
    return acc + precio * item.quantity;
  }, 0);

  // Cierre automático al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!cart.length && !open) return null;

  return (
    <>
      {open ? (
        <div ref={cartRef} className={style.cartPreview}>
          <div className={style.titleAndClose}>
            <h3>Carrito</h3>
            <IoMdClose onClick={handleClose} />
          </div>    <div className={style.Container}>
          <ul>
            {cart.map((item, index) => {
      
              return (
          
                  <li key={index} className={style.cartItem}>
                  <img
                    src={`/${item.imagen}`}
                    alt={item.nombre}
                    className={style.miniImage}
                  />
                  <p>{item.nombre}</p>
                  <p>
                    {item.quantity} {item.tipoVenta === "kg" ? "kg" : "u."}
                  </p>
                  <p>
                    $
                    {(
                      (item.precioConDescuento ?? item.precio) * item.quantity
                    ).toFixed(2)}
                  </p>
                </li>
              
              );
            })}
          </ul></div>
          <p className={style.total}>Total: ${total.toFixed(2)}</p>
          <button className={style.btn} onClick={()=> navigate("/cart")} >Terminar Compra</button>
        </div>
      ) : (
        <div className={style.miniTab} onClick={handleOpen}>
          🛒
        </div>
      )}
    </>
  );
}

export default CartPreview;
