import React from "react";
import style from "../../styles/AboutAs.module.css";

function AboutAs() {
  return (
    <div className={style.aboutUs}>
      <h2 className={style.title}>Sobre Nosotros</h2>
      <p className={style.aboutUsInfo}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, mollitia
        odit culpa perferendis iusto harum quaerat sequi eos nesciunt magni
        eveniet porro laboriosam in dolore eligendi! Dolorum natus repudiandae
        asperiores. <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
        impedit sit corporis aspernatur provident doloremque assumenda cum vero
        ab excepturi explicabo perferendis officia totam eveniet eos possimus
        ipsa, minus ullam!
      </p>
      <div className={style.containerIMG}>
        <p>FOTOS O INFORMACION ? LO QUE QUIERAN</p>
      </div>
    </div>
  );
}

export default AboutAs;
