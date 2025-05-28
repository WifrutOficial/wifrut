import { useState, useEffect, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Cart.module.css";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowDropleft } from "react-icons/io";
import Swal from "sweetalert2";
import zonasGeo from "../../data/envios.json";
import * as turf from "@turf/turf";
import debounce from "lodash/debounce";
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
  const [zonaDetectadaMsg, setZonaDetectadaMsg] = useState("");
  const [isLoadingZona, setIsLoadingZona] = useState(false);
  const [loading, setLoading] = useState(false);
  const [turno, setTurno] = useState("");
  // useEffect 1: setea los valores desde location.state
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

  const zonasEnvio = zonasGeo.features.map((feature) => {
    const name =
      feature.properties.name?.trim().replace(/\n/g, "") || "Zona sin nombre";
    const desc = feature.properties.description || "";
    const match = desc.match(/\d+/);
    const precio = match ? parseInt(match[0]) : 0;
    return { nombre: name, precio };
  });

  const total = getTotal();
  const totalConDescuento = metodoPago === "Efectivo" ? total * 0.9 : total;
  const totalFinal = totalConDescuento + (costoEnvio || 0);

  const handlePagoChange = (metodo) => setMetodoPago(metodo);

  const handleNextStep = () => {
    if (!direccion.trim() || !zonaSeleccionada) {
      Swal.fire({
        title: false,
        text: "Por favor ingresa una dirección y selecciona una zona válida.",
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

        const orderId = response.data.order?._id;
        if (orderId && metodoPago === "Mercado Pago") {
          createMercadoPagoPreference(orderId);
        }
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
      if (
        error.message === "Debes estar autenticado para realizar un pedido."
      ) {
        Swal.fire({
          title: "Inicia sesión",
          text: "Por favor, inicia sesión para realizar el pedido.",
          icon: "warning",
          confirmButtonText: "Ir al login",
          customClass: {
            popup: style.customAlert,
            icon: style.customIcon,
          },
        }).then(() => {
          navigate("/login");
        });
      } else {
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
      }
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

  const createMercadoPagoPreference = async (orderId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mercadopago/preference`,
        { orderId },
        { withCredentials: true }
      );
      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      }
    } catch (error) {
      console.error("Error al crear la preferencia de pago:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo iniciar el pago con Mercado Pago.",
        icon: "error",
        timer: 2500,
        showConfirmButton: false,
        customClass: {
          popup: style.customAlert,
          icon: style.customIcon,
        },
      });
    }
  };

  const buscarZona = useCallback(
    debounce(async (nuevaDireccion) => {
      if (nuevaDireccion.length < 5) {
        setZonaSeleccionada("");
        setCostoEnvio(0);
        setZonaDetectadaMsg("");
        setIsLoadingZona(false);
        return;
      }

      setIsLoadingZona(true);

      try {
        const direccionCompleta = `${nuevaDireccion}, Neuquén, Argentina`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          direccionCompleta
        )}&addressdetails=1&limit=1`;

        const response = await fetch(url, {
          headers: {
            "User-Agent": "TuApp/1.0 (contacto@tuapp.com)",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.length) {
          setZonaSeleccionada("");
          setCostoEnvio(0);
          setZonaDetectadaMsg(
            "⚠️ No se pudo encontrar la dirección ingresada."
          );
          setIsLoadingZona(false);
          return;
        }

        const { lat, lon } = data[0];
        const punto = turf.point([parseFloat(lon), parseFloat(lat)]);

        const zona = zonasGeo.features.find((feature) =>
          turf.booleanPointInPolygon(punto, feature)
        );

        if (zona) {
          const nombreZona =
            zona.properties.name?.trim().replace(/\n/g, "") ||
            "Zona desconocida";
          const desc = zona.properties.description || "";
          const match = desc.match(/\d+/);
          const precio = match ? parseInt(match[0]) : 0;

          setZonaSeleccionada(nombreZona);
          setCostoEnvio(precio);
          setZonaDetectadaMsg(
            `🗺️ Zona detectada automáticamente: ${nombreZona} ($${precio})`
          );
        } else {
          setZonaSeleccionada("");
          setCostoEnvio(0);
          setZonaDetectadaMsg(
            "⚠️ Dirección fuera de las zonas de envío definidas."
          );
        }
      } catch (error) {
        console.error("Error al detectar zona:", error);
        let errorMsg = "⚠️ Error al procesar la dirección.";
        if (error.message.includes("Failed to fetch")) {
          errorMsg =
            "⚠️ No se pudo conectar con el servicio de geolocalización. Por favor, selecciona una zona manualmente.";
        } else if (error.message.includes("403")) {
          errorMsg =
            "⚠️ Acceso denegado por el servicio de geolocalización. Por favor, selecciona una zona manualmente.";
        } else if (error.message.includes("429")) {
          errorMsg =
            "⚠️ Demasiadas solicitudes al servicio de geolocalización. Intenta de nuevo en unos segundos.";
        }
        setZonaDetectadaMsg(errorMsg);
      } finally {
        setIsLoadingZona(false);
      }
    }, 1000),
    []
  );

  const handleDireccionChange = (e) => {
    const nuevaDireccion = e.target.value;
    setDireccion(nuevaDireccion);
    buscarZona(nuevaDireccion);
  };

  useEffect(() => {
    if (!direccion.trim()) {
      setZonaSeleccionada("");
      setCostoEnvio(0);
      setZonaDetectadaMsg("");
      setIsLoadingZona(false);
    }
  }, [direccion]);

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
              direccion.trim() ? style.completed : ""
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
                    src={`../../../${item.imagen}`} // Ajusta según la estructura de tu servidor
                    alt={item.nombre}
                    className={style.miniImage}
                  />
                  <p>{item.nombre}</p>
                  <p>
                    {item.quantity} {item.tipoVenta === "kg" ? "kg" : "u."}
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
            <p>Costo Envío: ${costoEnvio || 0}</p>
            Total productos: $
            {metodoPago === "Efectivo"
              ? (total * 0.9).toFixed(2)
              : total.toFixed(2)}
          </div>

          <div className={style.envio}>
            <div className={style.Envio}>
              <div className={style.inputEnvio}>
                <p>Dirección de envío:</p>
                <input
                  type="text"
                  placeholder="Escribe tu dirección"
                  value={direccion}
                  onChange={handleDireccionChange}
                  aria-label="Dirección de envío"
                />
              </div>
              <p>Elegir el horario de envio ⏰</p>
              <div>
                <div className={style.mañanaTardeContainer}> 
                  <label htmlFor="mañana">mañana: 10:30 a 13:30</label>
                  <input
                    type="radio"
                    id="mañana"
                    name="turno"
                    value="mañana"
                    onChange={handleChange}
                  />
                </div>
                <div className={style.mañanaTardeContainer}>
                  <label htmlFor="tarde">tarde: 14:00 a 1</label>
                  <input
                    type="radio"
                    value="tarde"
                    name="turno"
                    id="tarde"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={style.inputEnvio}>
                <select
                  value={zonaSeleccionada}
                  onChange={(e) => {
                    const zona = zonasEnvio.find(
                      (z) => z.nombre === e.target.value
                    );
                    if (zona) {
                      setZonaSeleccionada(zona.nombre);
                      setCostoEnvio(zona.precio);
                      setZonaDetectadaMsg(
                        `🖐️ Zona seleccionada manualmente: ${zona.nombre} ($${zona.precio})`
                      );
                    }
                  }}
                  aria-label="Seleccionar zona de envío"
                >
                  <option value="">Selecciona una zona</option>
                  {zonasEnvio.map((zona) => (
                    <option key={zona.nombre} value={zona.nombre}>
                      {zona.nombre} - ${zona.precio}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={style.containerEnvio}>
              <p className={style.infoEnvio}>
                Para más información sobre las zonas de envío visite:
                <span
                  className={style.spanm}
                  onClick={() =>
                    navigate("/send", { state: { fromCart: true } })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate("/send", { state: { fromCart: true } })
                  }
                >
                  Envíos
                </span>
              </p>
            </div>
            {isLoadingZona && (
              <p className={style.zonaDetectada}>⏳ Buscando zona...</p>
            )}
            {zonaDetectadaMsg && !isLoadingZona && (
              <p className={style.zonaDetectada}>{zonaDetectadaMsg}</p>
            )}
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
