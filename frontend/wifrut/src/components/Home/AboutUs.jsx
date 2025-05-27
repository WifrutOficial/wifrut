import style from "../../styles/AboutUs.module.css";

function AboutUs() {
  return (
    <div className={style.aboutUs}>
      <h2 id="sobre-nosotros" className={style.title}>
        Conócenos
      </h2>

      <div className={style.containerInfo}>
        <div className={style.Info}>
          <h3 id="about">¿Quiénes somos?</h3>
          <p className={style.p}>
            En WIFRUT somos la verdulería en tu puerta. Dos jóvenes neuquinos
            emprendedores con las ganas de traer algo innovador a Neuquén.
            Trabajamos directamente con mayoristas y productores de la zona para
            ofrecerte lo más fresco de la Patagonia, seleccionado con cuidado y
            entregado en tus manos.
            <br></br>
            Nacimos para facilitar la vida a quienes valoran su tiempo, tienen
            movilidad reducida o simplemente prefieren invertir sus energías en
            lo que más les importa. Con "La verdulería en tu puerta", llevamos
            la frescura y la calidad de siempre, pero con la comodidad de un
            clic.
          </p>
          <h3 className={style.h3}>Nuestro Equipo</h3>
          <div className={style.imgContainer}>
           <div className={style.imgContainer2}>
             <img
              className={style.imgAbout}
              src="../../../img-equipo3.jpeg"
              alt="img-equipo1"
            />
            <p>Martin Otaran</p>
           </div>
          <div className={style.imgContainer2}>
              <img
              className={style.imgAbout}
              src="../../../img-equipo2.jpeg"
              alt="img-equipo2"
            />
           <p>Matias Osorio</p>
          </div>
          </div>
        </div>
      </div>

      <div className={style.containerInfo2}>
        <div className={style.Info}>
          <h3>Ubicados en Neuquén</h3>
          <p className={style.p}>
            Nuestra base de operaciones y desde donde sucede toda la logística
            para entregarte tus productos de primera calidad es en el mercado
            concentrador de Neuquén.
          </p>
        </div>
      
      </div>

      <div className={style.map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!3m2!1ses!2sar!4v1746985216220!5m2!1ses!2sar!6m8!1m7!1sB7RclvY-OSwnWkpPwlFpHQ!2m2!1d-38.88954677790815!2d-68.10160552087919!3f214.21022188544507!4f-2.788713398437366!5f0.7820865974627469"
          
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
