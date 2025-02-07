import React, { useState } from "react";
import style from "../../styles/Nav.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { BiSolidOffer, BiCategory } from "react-icons/bi";
import { IoSearch, IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Nav() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={style.container}>
      <div className={style.containerLinks}>
        <img src="" alt="logo" />
        <IoMenu onClick={toggleMenu} className={style.btnMenu} />

        <div className={`${style.containerLinks2} ${isOpen ? style.open : ""}`}>
          <IoMdClose onClick={toggleMenu} className={style.btnClose} />
          <a className={style.a}>
            Ofertas
            <BiSolidOffer />
          </a>
          <a className={style.a} >
            Categorías
            <BiCategory />
          </a>
          <a className={style.a} onClick={() => navigate("/cart")}>
            Mi Carrito
            <FaShoppingCart />
          </a>
          {isAuthenticated ? (
            <button className={style.btnCerrarSesion} onClick={logout}>
              Cerrar Sesion
            </button>
          ) : (
            <button className={style.btn} onClick={() => navigate("/register")}>
              Ingresar
            </button>
          )}
        </div>
      </div>

      <div className={style.svg}>
     
        <div className={style.search}>
          <input type="text" placeholder="Buscar productos" />
          <IoSearch className={style.searchBtn} />
        </div>
      </div>
    </div>
  );
}

export default Nav;
