import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import style from "../../styles/CartPrewie.module.css";
import formatNumber from "../../utils/formatNumber";

function CartPreview() {
  const { cart, removeFromCart } = useCart();
  const [open, setOpen] = useState(true);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const total = cart.reduce((acc, item) => {
    const precio = item.precioConDescuento ?? item.precio;
    return acc + precio * item.quantity;
  }, 0);

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

  const isKg = (tipoVenta) =>
    tipoVenta && tipoVenta.toLowerCase().includes("kilo");

  return (
    <>
      {open && (
        <div className={style.cartPreviewWrapper}>
          <div ref={cartRef} className={style.cartPreview}>
            <div className={style.titleAndClose}>
              <h3>Carrito</h3>
              <IoMdClose onClick={handleClose} />
            </div>

            <div className={style.Container}>
              {cart.length === 0 ? (
                <div className={style.emptyCartContainer}>
                  <TiShoppingCart
                    className={`${style.emptyCartIcon} ${style.animatedIcon}`}
                  />
                  <h2 className={style.emptyCart}>Tu carrito está vacío</h2>
                  <p className={style.emptyCartSub}>
                    ¡Es el momento perfecto para llenarlo con algo especial!
                  </p>
                  <button
                    className={style.shopButton}
                    onClick={() => setOpen(false)}
                  >
                    <div
                      onClick={() => {
                        const el = document.getElementById("ofertas");
                        if (el) {
                          const y =
                            el.getBoundingClientRect().top +
                            window.pageYOffset -
                            200;
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      }}
                    >
                      ← Empezar a comprar
                    </div>
                  </button>
                </div>
              ) : (
                <>
                  <ul>
                    {cart.map((item, index) => (
                      <li key={index} className={style.cartItem}>
                        <img
                          src={`/${item.imagen}`}
                          alt={item.nombre}
                          className={style.miniImage}
                        />
                        <p>{item.nombre}</p>
                        <p>
                          {item.quantity} {isKg(item.tipoVenta) ? "kg" : "u."}
                        </p>
                        <p>
                          $
                          {
                            formatNumber(
                              (item.precioConDescuento ?? item.precio) * item.quantity
                            )
                          }
                        </p>
                        <button
                          className={style.btnDelete}
                          onClick={() => removeFromCart(item._id)}
                          title="Eliminar producto"
                        >
                          <IoTrashOutline />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className={style.total}>Total: ${formatNumber(total)}</p>
                  <button
                    className={style.btn}
                    onClick={() => {
                      setOpen(false);
                      navigate("/cart");
                    }}
                  >
                    Terminar Compra
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {!open && (
        <div className={style.miniTab} onClick={handleOpen}>
          🛒
        </div>
      )}
    </>
  );
}

export default CartPreview;
