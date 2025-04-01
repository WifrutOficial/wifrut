import React, { useState, useEffect } from "react";
import { IoSearch, IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BsCart2 } from "react-icons/bs";
import { useSearch } from "../../context/SearchContext";
import { useCart } from "../../context/CartContext";
import { IoIosArrowDropup } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import style from "../../styles/Nav2.module.css";

function Nav2() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isFixed, setIsFixed] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const { cart } = useCart();

  // Calcular la cantidad total de productos
  const totalProductos = cart.length;

  // Calcular el total del carrito
  const total = cart.reduce((acc, item) => {
    const precioFinal = item.precioConDescuento || item.precio;
    return acc + item.quantity * precioFinal;
  }, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }

      if (window.scrollY > 100) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={style.container}>
      <div className={style.containerLog}>
        <p className={style.titleLog}>Productos Saludables Seleccionados</p>
      </div>
      <div className={`${style.containerLinks} ${isFixed ? style.fixed : ""}`}>
        <div className={style.logoContainer}>
          <img className={style.logo} src="../../../logo.png" alt="logo" />
          <IoMenu onClick={toggleMenu} className={style.btnMenu} />
        </div>
        <div className={`${style.linkContainer} ${isOpen ? style.open : ""}`}>
          <IoMdClose onClick={toggleMenu} className={style.btnClose} />
          {!isAuthenticated ? (
            <FaRegUser
              className={style.logoUser2}
              onClick={() => navigate("/login")}
            />
          ) : (
            < div className={style.btnCerrarSesion}>
            <button  onClick={logout}>
              Cerrar Sesion
            </button>
            <AiOutlineLogout />
          </div>
          )}
          <a className={style.a} onClick={handleScrollToTop}>
            Inicio
          </a>
          <a
            className={style.a}
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          >
            Ofertas
          </a>
          <a
            className={style.a}
            onClick={() => window.scrollTo({ top: 2320, behavior: "smooth" })}
          >
            Conócenos
          </a>
          <a className={style.a}>Envios</a>
        </div>
        <div className={style.search}>
          <input
            className={style.input}
            type="text"
            placeholder="Buscar productos"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <IoSearch className={style.searchBtn} />
          <div className={style.cartContainer}>
            <BsCart2 className={style.cart} onClick={() => navigate("/cart")} />
            <div className={style.CartNumber}>
              <p>{totalProductos}</p>
            </div>
            <p className={style.totalNumber}>${total.toFixed(2)}</p>
          </div>
        </div>
        {!isAuthenticated ? (
          <FaRegUser
            className={style.logoUser}
            onClick={() => navigate("/login")}
          />
        ) : (
          < div className={style.btnCerrarSesion2}>
            <button  onClick={logout}>
              Cerrar Sesion
            </button>
            <AiOutlineLogout />
          </div>
        )}
      </div>
      {/* Flecha flotante (solo se muestra después de hacer scroll) */}
      {showArrow && (
        <div onClick={handleScrollToTop} className={style.floatingArrow}>
          <IoIosArrowDropup size={50} />
        </div>
      )}
    </div>
  );
}

export default Nav2;
