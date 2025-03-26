import React, { useState, useEffect } from "react";
import style from "../../styles/Nav.module.css";
import { IoSearch, IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BsCart2 } from "react-icons/bs";
import { useSearch } from "../../context/SearchContext";
import { useCart } from "../../context/CartContext";
import { IoIosArrowDropup } from "react-icons/io";


function Nav() {
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

      // Mostrar la flecha flotante solo después de un cierto desplazamiento
      if (window.scrollY > 100) { // Cambia 100 a la cantidad de desplazamiento que desees
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={style.container}>
      {isAuthenticated ? (
        <div className={`${style.containerLog} ${isOpen ? style.open : ""}`}>
          <button className={style.btnCerrarSesion} onClick={logout}>
            Cerrar Sesion
          </button>
        </div>
      ) : (
        <div className={`${style.containerLog} ${isOpen ? style.open : ""}`}>
          <p className={style.titleLog}>Productos Saludables Seleccionados</p>
          <button className={style.btn1} onClick={() => navigate("/register")}>
            Crear Cuenta
          </button>
          <button className={style.btn} onClick={() => navigate("/login")}>
            Ingresar
          </button>
        </div>
      )}

      <div className={`${style.containerLinks} ${isFixed ? style.fixed : ""}`}>
        <div className={style.container2}>
          <img 
            className={style.logo} 
            src="../../../logo.png" 
            alt="logo" 
            onClick={handleScrollToTop}
          />
          <IoMenu onClick={toggleMenu} className={style.btnMenu} />

          <div className={`${style.containerLinks2} ${isOpen ? style.open : ""}`}>
            <IoMdClose onClick={toggleMenu} className={style.btnClose} />
            <a className={style.a} onClick={handleScrollToTop}>Inicio</a>
            <a className={style.a} onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}>Ofertas</a>
          </div>
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
      </div>

      {/* Flecha flotante (solo se muestra después de hacer scroll) */}
      {showArrow && (
        <div
          onClick={handleScrollToTop}
          className={style.floatingArrow}

        >
          <IoIosArrowDropup size={50} /> 
        </div>
      )}
    </div>
  );
}

export default Nav;
