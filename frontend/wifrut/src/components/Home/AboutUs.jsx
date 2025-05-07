import React from "react";
import style from "../../styles/AboutUs.module.css";

function AboutUs() {
  return (
    <div className={style.aboutUs}>
      <h2 className={style.title}>Conócenos</h2>

      <div className={style.containerInfo}>
        <img src="../../../img1.png" alt="Equipo de trabajo" />
        <div className={style.Info}>
          <h3>¿Quiénes somos?</h3>
          <p>
            En WIFRUT somos la verdulería en tu puerta. Dos jóvenes
            emprendedores unidos por las ganas de traer algo innovador a
            Neuquén, y buscando facilitar una tarea del día a día... trabajamos
            directamente con distribuidores para ofrecerte lo más fresco que
            llega a la Patagonia, seleccionado con cuidado y entregado en tus
            manos. <br></br>
            Nacimos para facilitar la vida a quienes valoran su tiempo, tienen
            movilidad reducida o simplemente prefieren invertir sus energías en
            lo que más les importa. Con "La verdulería en tu puerta", llevamos
            la frescura y la calidad de siempre, pero con la comodidad de un
            clic.
          </p>
        </div>
      </div>

      <div className={style.containerInfo}>
        <div className={`${style.Info} ${style.left}`}>
          <h3>Ubicados en Neuquén</h3>
          <p>
          Nuestra base de operaciones y desde donde sucede toda la logística para entregarte tus
          productos de primera calidad es en el mercado concentrador de Neuquén.
          </p>
        </div>
        <img src="../../../neuquen.png" alt="Ubicación en Neuquén" />
      </div>

      <div className={style.map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1741735490324!6m8!1m7!1suddi9Q-Swa9XcpWDuWRAnw!2m2!1d-38.95172297333154!2d-68.05908758013764!3f36.8215!4f0!5f0.7820865974627469"
          width="50%"
          height="300px"
          style={{
            borderRadius: "13px",
            border: "0",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.62)",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default AboutUs;
