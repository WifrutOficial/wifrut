import React from "react";
import style from "../../../../styles/ContactoMayorista.module.css";


function ContactoMayorista() {


  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <img className={style.img} src="../../../../../public/logo.png" alt="logo" />
        <p className={style.title}>Gracias por elegirnos para tu negocio.</p>
        <p className={style.message}>
          Hemos registrado tu inscripción como mayorista y uno de nuestros
          representantes te llamará al{" "}
          <span className={style.highlight}>telefono</span> para ultimar
          detalles y darte la mejor atención.
        </p>
        <button>Ok. volver al menu principal</button>
      </div>
    </div>
  );
}

export default ContactoMayorista;
