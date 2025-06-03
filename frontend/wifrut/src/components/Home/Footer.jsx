import style from "../../styles/Footer.module.css";
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
          <p className={style.rs}>CONTACTANOS</p>
          <div className={style.Info}>
            <FaWhatsapp />
            <p>+54 9 2995 974-289</p>
          </div>

          <div className={style.Info}>
            <IoIosMail />
            <p>wifrut.oficial@gmail.com</p>
          </div>
          <div className={style.Info}>
            <FaMapMarkerAlt />
            <p>Galpón número 9 anexo nave sur</p>
          </div>
        </div>
        <div className={style.containerContact}>
          <p className={style.rs}>REDES SOCIALES</p>
          <div className={style.Info}>
            <FaInstagram />
            <p>
              <a
                href="https://www.instagram.com/wifrut.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className={style.link} 
              >
                WifrutOficial
              </a>
            </p>
          </div>
          <div className={style.Info}>
            <FaSquareFacebook />
            <p>
              <a
                href="https://www.facebook.com/profile.php?id=61575813925313"
                target="_blank"
                rel="noopener noreferrer"
                className={style.link} 
              >
                WifrutOficial
              </a>
            </p>
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
          <p>{"< CODEX-Astra />"}</p>{" "}
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
