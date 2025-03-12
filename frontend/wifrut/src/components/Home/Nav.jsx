import React, { useState, useEffect } from "react";
import style from "../../styles/Nav.module.css";
import { IoSearch, IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BsCart2 } from "react-icons/bs";
import { useSearch } from "../../context/SearchContext";
import { useCart } from "../../context/CartContext"; 

function Nav() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { searchQuery, updateSearchQuery } = useSearch();
  const [isFixed, setIsFixed] = useState(false);
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    updateSearchQuery(e.target.value); 
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
          <img className={style.logo} src="../../../logo.png" alt="logo" />
          <IoMenu onClick={toggleMenu} className={style.btnMenu} />

          <div className={`${style.containerLinks2} ${isOpen ? style.open : ""}`}>
            <IoMdClose onClick={toggleMenu} className={style.btnClose} />
            <a className={style.a}  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} >Inicio</a>
            <a className={style.a}  onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}  >Ofertas</a>
            <a className={style.a} onClick={() => navigate("/cart")}>
              Envios y Zonas
            </a>
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
    </div>
  );
}

export default Nav;
