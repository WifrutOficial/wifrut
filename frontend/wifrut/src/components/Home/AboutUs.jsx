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
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
            ipsam distinctio officiis voluptatem adipisci recusandae mayores!
            Deserunt, modi? Ullam, impedit suscipit dicta at nostrum doloribus
            molestiae perspiciatis architecto nobis possimus?
          </p>
        </div>
      </div>

      <div className={style.containerInfo}>
        <div className={`${style.Info} ${style.left}`}>
          <h3>Ubicados en Neuquén</h3>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi
            ipsam distinctio officiis voluptatem adipisci recusandae mayores!
            Deserunt, modi? Ullam, impedit suscipit dicta at nostrum doloribus
            molestiae perspiciatis architecto nobis possimus?
          </p>
        </div>
        <img src="../../../neuquen.png" alt="Ubicación en Neuquén" />
      </div>

      <div className={style.map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1741735490324!6m8!1m7!1suddi9Q-Swa9XcpWDuWRAnw!2m2!1d-38.95172297333154!2d-68.05908758013764!3f36.8215!4f0!5f0.7820865974627469"
          width="100%"
          height="300px"
          style={{ 
            borderRadius: "13px",
            border: "0", 
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.62)" 
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
