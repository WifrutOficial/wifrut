import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Cart.module.css";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import Swal from "sweetalert2";
import zonasGeo from "../../data/envios.json";
import { TiShoppingCart } from "react-icons/ti";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, checkout, getTotal } = useCart();
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [step, setStep] = useState(1);
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [loading, setLoading] = useState(false);
  const [turno, setTurno] = useState("");

  useEffect(() => {
    if (location.state) {
      if (location.state.direccion) setDireccion(location.state.direccion);
      if (location.state.turno) setTurno(location.state.turno);
      if (location.state.metodoPago) setMetodoPago(location.state.metodoPago);
      if (location.state.zonaSeleccionada)
        setZonaSeleccionada(location.state.zonaSeleccionada);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setTurno(e.target.value);
  };

  const zonasEnvio = zonasGeo.features
    .filter(feature => feature.geometry.type === "Polygon")
    .map((feature) => {
      const name =
        feature.properties.name?.trim().replace(/\n/g, "") || "Zona sin nombre";
      const desc = feature.properties.description || "";
      const match = desc.match(/\d+/);
      const precio = match ? parseInt(match[0]) : 0;
      return { nombre: name, precio };
    });

  const total = getTotal();
  const envioFinal = total >= 80000 ? 0 : costoEnvio;
  const totalConDescuento = metodoPago === "Efectivo" ? total * 0.9 : total;
  const totalFinal = totalConDescuento + (envioFinal || 0);

  const handlePagoChange = (metodo) => setMetodoPago(metodo);

  const handleNextStep = () => {
    if (total < 25000) {
      Swal.fire({
        title: "Compra mínima",
        text: "El monto mínimo de compra es de $25.000 para poder continuar.",
        icon: "info",
        timer: 3000,
        showConfirmButton: false,
        customClass: { popup: style.customAlert, icon: style.customIcon },
      });
      return;
    }

    if (!direccion.trim() || !zonaSeleccionada) {
      Swal.fire({
        title: false,
        text: "Por favor ingresa una dirección y selecciona una zona válida.",
        icon: "warning",
        timer: 2500,
        showConfirmButton: false,
        customClass: { popup: style.customAlert, icon: style.customIcon },
      });
      return;
    }
    setStep(2);
  };

  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!metodoPago) {
      Swal.fire({
        title: false,
        text: "Por favor selecciona un método de pago.",
        icon: "warning",
        timer: 2500,
        showConfirmButton: false,
        customClass: {
          popup: style.customAlert,
          icon: style.customIcon,
        },
      });
      return;
    }
    setLoading(true);
    try {
      const response = await checkout(
        direccion,
        metodoPago,
        totalFinal,
        costoEnvio,
        turno
      );
      if (response && response.status === 201) {
        Swal.fire({
          title: "¡Gracias por elegir Wifrut!",
          text: `Tu pedido nº ${response.data.order.numeroPedido}. ha sido recibido. Te enviamos un mail con el detalle de tu compra a ${user.email}`,
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "Aceptar",
          customClass: {
            popup: style.customAlert,
            icon: style.customIconSuc,
          },
        }).then(() => {
          clearCart();
          navigate("/");
        });

      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un error al procesar tu pedido.",
          icon: "error",
          timer: 2500,
          showConfirmButton: false,
          customClass: {
            popup: style.customAlert,
            icon: style.customIcon,
          },
        });
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
        customClass: {
          popup: style.customAlert,
          icon: style.customIcon,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmarVaciarCarrito = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a vaciar el carrito y no podrás deshacer esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar carrito",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#247504",
      cancelButtonColor: "#B90003",
      customClass: {
        popup: style.customAlert,
        icon: style.customIcon,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        console.log("Carrito vaciado");
      }
    });
  };

  const isKg = (tipoVenta) => {
    return tipoVenta && tipoVenta.toLowerCase().includes("kilo");
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Carrito de Compras</h2>
      {cart.length > 0 && (
        <div className={style.lineTime}>
          <div className={`${style.step} ${style.completed}`}>
            <span className={style.stepNumber}>1</span>
            <p>Productos</p>
          </div>
          <div
            className={`${style.step} ${
              direccion.trim() && zonaSeleccionada ? style.completed : ""
            }`}
          >
            <span className={style.stepNumber}>2</span>
            <p>Dirección</p>
          </div>
          <div
            className={`${style.step} ${
              step === 2 && metodoPago ? style.completed : ""
            }`}
          >
            <span className={style.stepNumber}>3</span>
            <p>Método de Pago</p>
          </div>
        </div>
      )}

      {cart.length === 0 ? (
        <div className={style.emptyCartContainer}>
          <TiShoppingCart
            className={`${style.emptyCartIcon} ${style.animatedIcon}`}
            aria-hidden="true"
          />
          <h2 className={style.emptyCart}>Tu carrito está vacío</h2>
          <p className={style.emptyCartSub}>
            ¡No te vayas sin tus frutas y verduras favoritas!
          </p>
          <button
            className={style.shopButton}
            onClick={() => navigate("/")}
            aria-label="Volver a la página de productos"
          >
            ← Empezar a comprar
          </button>
        </div>
      ) : (
        <div className={style.containerCart}>
          <IoIosArrowDropleft
            className={style.arrow}
            onClick={() => navigate("/")}
            aria-label="Volver a la página principal"
          />

          <ul className={style.cart}>
            {cart.map((item, index) => {
              const precioFinal = item.precioConDescuento ?? item.precio;
              return (
                <li key={item._id || index} className={style.cartItem}>
                  <img
                    src={`/${item.imagen}`}
                    alt={item.nombre}
                    className={style.miniImage}
                  />
                  <p>{item.nombre}</p>
                  <p>
                    {item.quantity} {isKg(item.tipoVenta) ? "kg" : "u."}
                  </p>
                  <p className={style.priceTotal}>
                    ${(precioFinal * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className={style.btnDelete}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                  >
                    <IoTrashOutline />
                  </button>
                </li>
              );
            })}
          </ul>

          <hr />
          
          <div className={style.total}>
            {total >= 80000 && (
              <p className={style.envioGratis}>
                🎉 ¡Felicidades! Tu envío es gratis.
              </p>
            )}
            <p>Costo Envío: ${envioFinal || 0}</p>
            <p>
              Total productos: $
              {metodoPago === "Efectivo"
                ? (total * 0.9).toFixed(2)
                : total.toFixed(2)}
            </p>
          </div>

          <div className={style.envio}>
            <div className={style.Envio}>
                <div className={style.inputEnvio}>
                    <p>Dirección completa de envío:</p>
                    <input
                      type="text"
                      placeholder="Ej: Av. Argentina 123, Piso 4, Dpto B"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      aria-label="Dirección de envío"
                    />
                </div>

                <div className={style.inputEnvio}>
                  <p>Selecciona tu zona de envío:</p>
                  <select   className={style.zonaSelect} 
                    value={zonaSeleccionada}
                    onChange={(e) => {
                      const nombreZonaSeleccionada = e.target.value;
                      const zona = zonasEnvio.find(z => z.nombre === nombreZonaSeleccionada);
                      if (zona) {
                        setZonaSeleccionada(zona.nombre);
                        setCostoEnvio(zona.precio);
                      } else {
                        setZonaSeleccionada("");
                        setCostoEnvio(0);
                      }
                    }}
                    aria-label="Seleccionar zona de envío"
                  >
                    <option value="">-- Elige tu zona --</option>
                    {zonasEnvio.map((zona, index) => (
                      <option key={`${zona.nombre}-${index}`} value={zona.nombre}>
                        {zona.nombre} - ${zona.precio}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={style.containerEnvio}>
                  <p className={style.infoEnvio}>
                    ¿No sabes cuál es tu zona? Consulta nuestro
                    <span
                      className={style.spanm}
                      onClick={() => navigate("/send")}
                      role="button"
                    >
                      &nbsp;Mapa de Envíos
                    </span>
                  </p>
                </div>

                <p>Elegir el horario de envío ⏰</p>
                <div>
                  <div className={style.mañanaTardeContainer}>
                    <label htmlFor="mañana">Mañana: 10:30 a 13:30</label>
                    <input type="radio" id="mañana" name="turno" value="mañana" onChange={handleChange} />
                  </div>
                  <div className={style.mañanaTardeContainer}>
                    <label htmlFor="tarde">Tarde: 14:00 a 18:00</label>
                    <input type="radio" id="tarde" name="turno" value="tarde" onChange={handleChange} />
                  </div>
                </div>
            </div>
          </div>

          {step === 1 && (
            <div className={style.btnContainer}>
              <button
                onClick={handleNextStep}
                aria-label="Ir al siguiente paso"
              >
                Siguiente
              </button>
            </div>
          )}

          <p className={style.fullTotal}>
            Total Final: ${totalFinal.toFixed(2)}
          </p>

          {step === 2 && (
            <>
              <p className={style.titlePago}>Método de pago</p>
              <div className={style.containerPago}>
                {[
                  { nombre: "Efectivo", icono: "/efectivo.png" },
                  { nombre: "Mercado Pago", icono: "/mpicon.png" },
                ].map(({ nombre, icono }) => (
                  <label key={nombre} className={style.containerPagoInput}>
                    <img
                      src={icono}
                      alt={nombre}
                      className={`${style.mp} ${
                        nombre === "Efectivo" ? style.ft : style.mp
                      }`}
                    />
                    <span className={style.PagoText}> {nombre}</span>
                    <input
                      type="radio"
                      name="metodoPago"
                      checked={metodoPago === nombre}
                      onChange={() => handlePagoChange(nombre)}
                      aria-label={`Seleccionar ${nombre} como método de pago`}
                    />
                  </label>
                ))}
              </div>
              <div className={style.containerDescuento} >
                <p>💸 Paga en efectivo y obtén hasta un 10% de descuento.</p>{" "}
                {metodoPago === "Efectivo"
                  ? "(¡aplicado!)"
                  : "(al elegir efectivo)"}
              </div>
              <div className={style.btnContainer}>
                <button
                  onClick={confirmarVaciarCarrito}
                  aria-label="Vaciar carrito"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleCheckout}
                  type="submit"
                  className={style.registerBtn}
                  disabled={loading}
                  aria-label="Realizar pedido"
                >
                  {loading ? (
                    <div className={style.spinner}></div>
                  ) : (
                    "Realizar Pedido"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}