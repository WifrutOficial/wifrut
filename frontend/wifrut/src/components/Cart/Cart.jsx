import React, { useState, useEffect, useCallback } from "react";
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

export default function Cart({ hideSearchAndCart = true }) {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, checkout, getTotal } = useCart();
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [step, setStep] = useState(1);
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [zonaDetectadaMsg, setZonaDetectadaMsg] = useState("");
  const [isLoadingZona, setIsLoadingZona] = useState(false);

  const zonasEnvio = zonasGeo.features.map((feature) => {
    const name =
      feature.properties.name?.trim().replace(/\n/g, "") || "Zona sin nombre";
    const desc = feature.properties.description || "";
    const match = desc.match(/\d+/);
    const precio = match ? parseInt(match[0]) : 0;
    return { nombre: name, precio };
  });

  const total = getTotal();
  const totalFinal = total + (costoEnvio || 0);

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

    try {
      const response = await checkout(direccion, metodoPago);
      if (response && response.status === 201) {
        Swal.fire({
          title: "¡Gracias por tu compra!",
          text: "Tu pedido fue realizado con éxito.",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
          customClass: {
            popup: style.customAlert,
            icon: style.customIconSuc,
          },
        }).then(() => {
          clearCart();
          navigate("/");
        });

        const orderId = response.data.order?._id;
        if (!orderId) return;

        if (metodoPago === "Mercado Pago") {
          createMercadoPagoPreference(orderId);
        }
      } else {
        alert("Hubo un error al procesar tu pedido.");
      }
    } catch (error) {
      console.error("Error en el checkout:", error);
      alert("Hubo un error al procesar tu pedido.");
    }
  };

  const createMercadoPagoPreference = async (orderId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mercadopago/preference`,
        { orderId }
      );
      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      }
    } catch (error) {
      console.error("Error al crear la preferencia de pago:", error);
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
            "User-Agent": "TuApp/1.0 (contacto@tuapp.com)", // Reemplaza con el nombre de tu app y un email de contacto
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
      {!hideSearchAndCart && (
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
          <IoTrashOutline
            className={`${style.emptyCartIcon} ${style.animatedIcon}`}
          />
          <h2 className={style.emptyCart}>Tu carrito está vacío</h2>
          <p className={style.emptyCartSub}>
            ¡Es el momento perfecto para llenarlo con algo especial!
          </p>
          <button className={style.shopButton} onClick={() => navigate("/")}>
          ← Empezar a comprar
          </button>
        </div>
      ) : (
        <div className={style.containerCart}>
          <IoIosArrowDropleft
            className={style.arrow}
            onClick={() => navigate("/")}
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
                    {item.quantity} {item.tipoVenta === "kg" ? "kg" : "u."}
                  </p>
                  <p className={style.priceTotal}>
                    ${(precioFinal * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className={style.btnDelete}
                  >
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
            <div className={style.Envio}>
              <div className={style.inputEnvio}>
                <p>Dirección de envío:</p>
                <input
                  type="text"
                  placeholder="Escribe tu dirección"
                  value={direccion}
                  onChange={handleDireccionChange}
                />
              </div>
              <p className={style.infoEnvio}>
                Para más información sobre las zonas de envío visite:{" "}
                <span
                  className={style.spanm}
                  onClick={() =>
                    navigate("/send", { state: { fromCart: true } })
                  }
                >
                  Envíos
                </span>
              </p>
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
                >
                  <option value="">Selecciona una zona</option>
                  {zonasEnvio.map((zona) => (
                    <option key={zona.nombre} value={zona.nombre}>
                      {zona.nombre} - ${zona.precio}
                    </option>
                  ))}
                </select>
              </div>

              <p>Costo Envío: ${costoEnvio || 0}</p>
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
              <button onClick={handleNextStep}>Siguiente</button>
            </div>
          )}

          <p className={style.fullTotal}>
            Total Final: ${totalFinal.toFixed(2)}
          </p>

          {step === 2 && (
            <>
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

              <div className={style.btnContainer}>
                <button
                  onClick={() =>
                    window.confirm("¿Estás seguro de vaciar el carrito?") &&
                    clearCart()
                  }
                >
                  Vaciar Carrito
                </button>
                <button onClick={handleCheckout}>Realizar Pedido</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
