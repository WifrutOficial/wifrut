import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import style from "../../styles/CartPrewie.module.css";
import { IoMdClose } from "react-icons/io";

function CartPreview() {
  const { cart } = useCart();
  const [open, setOpen] = useState(true);

  if (!cart.length && !open) return null;

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      {open ? (
        <div className={style.cartPreview}>
          <div className={style.titleAndClose}>
            <h3>Carrito</h3>
            <IoMdClose onClick={handleClose} />
          </div>
          <ul>
            {cart.map((item, index) => (
              <li key={index} className={style.cartItem}>
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
            ))}
          </ul>
          <button className={style.btn}>Terminar Compra</button>
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
