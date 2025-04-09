import React from 'react';
import Nav2 from './Nav2';
import Footer from './Footer';
import style from "../../styles/Send.module.css";
import MapaZonas from './MapaZonas';

function Send() {
  return (
    <div className={style.container}>
     <Nav2 hideSearchAndCart />


      <div className={style.infoZona}>
        <h2>Zonas de envío</h2>
        <p>
          A continuación te mostramos un mapa interactivo donde podés ver las zonas de entrega de Wifrut. 
          Cada zona está representada con un color distinto y tiene un costo de envío asociado.
        </p>
        <ul>
          <li><strong>Zona 1 (Verde):</strong> $2000</li>
          <li><strong>Zona 2 (Naranja):</strong> $3500</li>
          <li><strong>Zona 3 (Celeste):</strong> $4500</li>
          <li><strong>Zona 4 (Marrón):</strong> $6500</li>
          <li><strong>Centenario Zona 1 (Rojo oscuro):</strong> $???</li>
          <li><strong>Centenario Zona 2 (Violeta):</strong> $???</li>
        </ul>
        <p>
          El costo de envío se calcula automáticamente cuando ingresás tu dirección al hacer un pedido.
          Si tenés dudas sobre tu zona, podés buscar tu ubicación en el siguiente mapa.
        </p>
        

        <div className={style.infoMapa}>
          <p>
            🗺️ <strong>TIP:</strong> Hacé <strong>clic</strong> en una zona del mapa para ver su precio y detalles.
          </p>
        </div>
      </div>

      <div className={style.containerMap}>
        <MapaZonas />
      </div>
      <div className={style.backHomeContainer}>
  <button className={style.backHomeButton} onClick={() => window.location.href = '/'}>
  ← Regresar a la página principal
  </button>
</div>

      <Footer />
    </div>
  );
}

export default Send;
