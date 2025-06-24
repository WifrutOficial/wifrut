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
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [diasDisponibles, setDiasDisponibles] = useState([]);

  useEffect(() => {
    const calcularDiasDisponibles = () => {
      const hoy = new Date();
      const dias = [];

      for (let i = 1; dias.length < 5; i++) {
        const fecha = new Date();
        fecha.setDate(hoy.getDate() + i);
        const diaSemana = fecha.getDay();
        if (diaSemana >= 1 && diaSemana <= 5) {
          dias.push(fecha.toISOString().slice(0, 10));
        }
      }

      setDiasDisponibles(dias);
    };

    calcularDiasDisponibles();
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.direccion) setDireccion(location.state.direccion);
      if (location.state.turno) setTurno(location.state.turno);
      if (location.state.metodoPago) setMetodoPago(location.state.metodoPago);
      if (location.state.zonaSeleccionada)
        setZonaSeleccionada(location.state.zonaSeleccionada);
    }
  }, [location.state]);

  const handleChange = (e) => setTurno(e.target.value);

  const zonasEnvio = zonasGeo.features
    .filter((f) => f.geometry.type === "Polygon")
    .map((f) => {
      const name = f.properties.name?.trim().replace(/\n/g, "") || "Zona sin nombre";
      const desc = f.properties.description || "";
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
    if (step === 1 && total < 25000) {
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

    if (step === 2 && (!direccion.trim() || !zonaSeleccionada)) {
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

    if (step === 3 && (!turno || !fechaEntrega)) {
      Swal.fire({
        title: false,
        text: "Por favor seleccioná un día y horario de entrega.",
        icon: "warning",
        timer: 2500,
        showConfirmButton: false,
        customClass: { popup: style.customAlert, icon: style.customIcon },
      });
      return;
    }

    setStep((prev) => prev + 1);
  };

  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!metodoPago || !turno || !fechaEntrega) return;
    setLoading(true);
    try {
      const response = await checkout(
        direccion,
        metodoPago,
        totalFinal,
        costoEnvio,
        turno,
        fechaEntrega
      );
      if (response?.status === 201) {
        Swal.fire({
          title: "¡Gracias por elegir Wifrut!",
          text: `Tu pedido nº ${response.data.order.numeroPedido}. ha sido recibido.`,
          icon: "success",
          confirmButtonText: "Aceptar",
          customClass: { popup: style.customAlert, icon: style.customIconSuc },
        }).then(() => {
          clearCart();
          navigate("/");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al procesar el pedido.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
        customClass: { popup: style.customAlert, icon: style.customIcon },
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmarVaciarCarrito = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Vas a vaciar el carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar carrito",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#247504",
      cancelButtonColor: "#B90003",
      customClass: { popup: style.customAlert, icon: style.customIcon },
    }).then((r) => r.isConfirmed && clearCart());
  };

  const isKg = (tipoVenta) => tipoVenta?.toLowerCase().includes("kilo");

  return (
    <div className={style.container}>
      <h2 className={style.title}>Carrito de Compras</h2>
  {cart.length > 0 && (
  <div className={style.lineTime}>
    <div className={`${style.step} ${style.completed}`}>
      <span className={style.stepNumber}>1</span>
      <p>Productos</p>
    </div>
    <div className={`${style.step} ${direccion.trim() && zonaSeleccionada ? style.completed : ""}`}>
      <span className={style.stepNumber}>2</span>
      <p>Dirección</p>
    </div>
    <div className={`${style.step} ${turno && fechaEntrega ? style.completed : ""}`}>
      <span className={style.stepNumber}>3</span>
      <p>Entrega</p>
    </div>
    <div className={`${style.step} ${metodoPago ? style.completed : ""}`}>
      <span className={style.stepNumber}>4</span>
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
<div className={style.cartScrollBox}>
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
</div>


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
<div className={style.bloqueEntrega}>
  <h4 className={style.tituloBloqueEntrega}>📦 Día y horario de entrega</h4>

  <div className={style.inputEnvio}>
  <div className={style.opcionHorario}>
    <span>Tarde: 15:00 a 20:00</span>
    <input
      type="radio"
      id="tarde"
      name="turno"
      value="tarde"
      checked={turno === "tarde"}
      onChange={handleChange}
    />
  </div>
</div>


  {/* Día de entrega */}
  <div className={style.inputEnvio}>
    <p className={style.labelEntrega}>📅 Elegí el día de entrega</p>
    {diasDisponibles.length > 0 ? (
      <select
        className={style.zonaSelect}
        value={fechaEntrega}
        onChange={(e) => setFechaEntrega(e.target.value)}
      >
        <option value="">-- Seleccioná un día --</option>
        {diasDisponibles.map((fecha) => (
          <option key={fecha} value={fecha}>
            {new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </option>
        ))}
      </select>
    ) : (
      <p style={{ color: "red", fontSize: "0.95rem" }}>
        No hay días disponibles para entrega en este momento.
      </p>
    )}
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
            Total del pago: ${totalFinal.toFixed(2)}
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