import React from "react";
import style from "../../styles/Footer.module.css";
import { FaPhoneAlt } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { TbBrandLinktree } from "react-icons/tb";
function Footer() {
  return (
    <div className={style.container}>
      <div className={style.containerInfo}>
        <div className={style.containerContact}>
          <p>Contactanos</p>
          <div className={style.Info}>
            <FaWhatsapp />
            <p>23753822940</p>
          </div>
          <div className={style.Info}>
            <FaPhoneAlt />
            <p>23753822940</p>
          </div>
          <div className={style.Info}>
            <IoIosMail />
            <p>wifrut@verduleria.com</p>
          </div>
          <div className={style.Info}>
            <FaMapMarkerAlt />
            <p>calle verduleria 83745</p>
          </div>
        </div>
        <div className={style.containerContact}>
          <p>Redes Sociales</p>
          <div className={style.Info}>
            <FaInstagram />
            <p>WifrutVerduleria</p>
          </div>
          <div className={style.Info}>
            <FaSquareFacebook />
            <p>WifrutVerduleria</p>
          </div>
        </div>
      </div>
      <div className={style.derechos}>
        <div className={style.contact}>
          <p>Copyright Wifrut - 2025. Todos los derechos reservados.</p>
        </div>
        <div className={style.createBy}>
          <p>Creado por </p>
          <img
            className={style.imgDev}
            src="../../../LOGO COMPLETO.png"
            alt="logoDev"
          />
          <p>{"< CodexAstra />"}</p>{" "}
          <div className={style.contactDev}>
            <a href="https://www.linkedin.com/in/maira-coria/">
              <TbBrandLinktree />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
