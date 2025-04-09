import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Cart.module.css";
import { IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosArrowDropleft } from "react-icons/io";
import Swal from "sweetalert2";
import zonasGeo from "../../data/envios.json";
import * as turf from "@turf/turf";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, checkout, getTotal } = useCart();
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [step, setStep] = useState(1);
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [zonaDetectadaMsg, setZonaDetectadaMsg] = useState("");

  const zonasEnvio = zonasGeo.features.map((feature) => {
    const name =
      feature.properties.name?.trim().replace(/\n/g, "") || "Zona sin nombre";
    const desc = feature.properties.description || "";
    const match = desc.match(/\d+/);
    const precio = match ? parseInt(match[0]) : 0;

    return {
      nombre: name,
      precio,
    };
  });

  const total = getTotal();
  const totalFinal = total + (costoEnvio || 0);

  const handlePagoChange = (metodo) => setMetodoPago(metodo);

  const handleNextStep = () => {
    if (!direccion.trim() || !zonaSeleccionada) {
      Swal.fire({
        title: "¡Error!",
        text: "Por favor ingresa una dirección y selecciona una zona.",
        icon: "warning",
        confirmButtonColor: "#B90003",
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
        title: "¡Error!",
        text: "Por favor selecciona un método de pago.",
        icon: "warning",
        confirmButtonColor: "#B90003",
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
        alert("Pedido realizado con éxito.");
        clearCart();
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

  const handleDireccionChange = async (e) => {
    const nuevaDireccion = e.target.value;
    setDireccion(nuevaDireccion);

    if (nuevaDireccion.length < 5) return;

    try {
      const direccionCompleta = `${nuevaDireccion}, Neuquén, Argentina`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          direccionCompleta
        )}`
      );
      const data = await res.json();

      if (!data.length) return;

      const { lat, lon } = data[0];
      const punto = turf.point([parseFloat(lon), parseFloat(lat)]);

      const zona = zonasGeo.features.find((feature) =>
        turf.booleanPointInPolygon(punto, feature)
      );

      if (zona) {
        const nombreZona =
          zona.properties.name?.trim().replace(/\n/g, "") || "Zona desconocida";
        const desc = zona.properties.description || "";
        const match = desc.match(/\d+/);
        const precio = match ? parseInt(match[0]) : 0;

        setZonaSeleccionada(nombreZona);
        setCostoEnvio(precio);
        setZonaDetectadaMsg(
          `🗺️ Zona detectada automáticamente: ${nombreZona} ($${precio})`
        );
      } else {
        setZonaDetectadaMsg(
          "⚠️ Dirección fuera de las zonas de envío definidas."
        );
      }
    } catch (error) {
      console.error("Error al detectar zona:", error);
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Carrito de Compras</h2>

      <div className={style.lineTime}>
        <div className={`${style.step} ${style.completed}`}>
          <span className={style.stepNumber}>1</span>
          <p>Productos</p>
        </div>
        <div
          className={`${style.step} ${direccion.trim() ? style.completed : ""}`}
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

      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div className={style.containerCart}>
          <IoIosArrowDropleft
            className={style.arrow}
            onClick={() => navigate("/")}
          />

          <ul className={style.cart}>
            {cart.map(
              ({
                _id,
                nombre,
                precio,
                quantity,
                precioConDescuento,
                tipoVenta,
              }) => {
                const precioFinal = precioConDescuento ?? precio;
                return (
                  <li key={_id} className={style.cartItem}>
                    <p>{nombre}</p>
                    <div className={style.cantidades}>
                      <p>
                        {quantity} {tipoVenta === "kg" ? "kg" : "U"}
                      </p>
                    </div>
                    <p>Total: ${quantity * precioFinal}</p>
                    <button
                      onClick={() => removeFromCart(_id)}
                      className={style.btnDelete}
                    >
                      <IoTrashOutline />
                    </button>
                  </li>
                );
              }
            )}
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

              <div className={style.inputEnvio}>
                <p>Zonas:</p>
                <select
                  value={zonaSeleccionada}
                  onChange={(e) => {
                    f;
                    const zona = zonasEnvio.find(
                      (z) => z.nombre === e.target.value
                    );
                    if (zona) {
                      setZonaSeleccionada(zona.nombre);
                      setCostoEnvio(zona.precio);
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
            {zonaDetectadaMsg && (
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
