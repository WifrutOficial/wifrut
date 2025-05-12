import Nav2 from "./Nav2";
import Footer from "./Footer";
import style from "../../styles/Send.module.css";
import MapaZonas from "./MapaZonas";
import { useLocation, useNavigate } from "react-router-dom";

function Send() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromCart = location.state?.fromCart;

  const handleGoHome = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleGoCart = () => {
    navigate("/cart");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  return (
    <div className={style.container}>
      <Nav2 hideSearchAndCart />

      <div className={style.infoZona}>
        <h2>Zonas de envío</h2>
        <p>
          A continuación te mostramos un mapa interactivo donde podés ver las
          zonas de entrega de Wifrut. Cada zona está representada con un color
          distinto y tiene un costo de envío asociado.
        </p>
        <ul>
          <li>
            🟢{" "}
            <strong className={style.strong}>
              {" "}
              Neuquén Zona 1: <p className={style.price}>  $2000</p>{" "}
            </strong>
          </li>
          <li>
            🟠{" "}
            <strong  className={style.strong}>
              Neuquén Zona 2: <p className={style.price}> $3500</p>{" "}
            </strong>
          </li>
          <li>
            🔵{" "}
            <strong  className={style.strong}>
              Neuquén Zona 3: <p className={style.price}> $4500</p>
            </strong>
          </li>
          <li>
            🟤{" "}
            <strong  className={style.strong}>
              Plottier Zona 4: <p className={style.price}>  $6500</p>{" "}
            </strong>
          </li>
          <li>
            🔴{" "}
            <strong  className={style.strong}>
              Centenario Zona 1: <p className={style.price}> $2000</p>{" "}
            </strong>
          </li>
          <li>
            🟣
            <strong className={style.strong}>
              {" "}
              Centenario Zona 2: <p  className={style.price}>  $3500</p>{" "}
            </strong>
          </li>
        </ul>

        <p>
          El costo de envío se calcula automáticamente cuando ingresás tu
          dirección al hacer un pedido. Si tenés dudas sobre tu zona, podés
          buscar tu ubicación en el siguiente mapa.
        </p>

        <div className={style.infoMapa}>
          <p>
            🗺️ <strong>TIP:</strong> Hacé <strong>clic</strong> en una zona del
            mapa para ver su precio y detalles.
          </p>
        </div>
      </div>

      <div className={style.containerMap}>
        <MapaZonas />
      </div>
      <div className={style.backHomeContainer}>
        <button className={style.backHomeButton} onClick={handleGoHome}>
          ← Regresar a la página principal
        </button>
      </div>
      {/* Mostrar botón si vino desde el carrito */}
      {fromCart && (
        <div className={style.backHomeContainer}>
          <button className={style.backHomeButton} onClick={handleGoCart}>
            Terminar la compra →
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Send;
