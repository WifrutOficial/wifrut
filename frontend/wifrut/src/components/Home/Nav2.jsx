import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoSearch, IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BsCart2 } from "react-icons/bs";
import { useSearch } from "../../context/SearchContext";
import { useCart } from "../../context/CartContext";
import { IoIosArrowDropup } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import style from "../../styles/Nav2.module.css";
import { MdArrowDropDown } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { IoHome } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { MdLocalShipping } from "react-icons/md";
import CartPreview from "../../components/Cart/CartPreview";

function Nav2({ hideSearchAndCart = false }) {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isFixed, setIsFixed] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const { cart } = useCart();
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showCategorias, setShowCategorias] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleCategorias = () => {
    setShowCategorias(!showCategorias);
  };

  const totalProductos = cart.length;

  const total = cart.reduce((acc, item) => {
    const precioFinal = item.precioConDescuento || item.precio;
    return acc + item.quantity * precioFinal;
  }, 0);

  useEffect(() => {
    const getProductsBD = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/productos`,
          { withCredentials: true }
        );
        setProducts(response.data);
        const categorias = [
          ...new Set(response.data.map((product) => product.categoria)),
        ];
        setCategorias(categorias);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    getProductsBD();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 20);
      setShowArrow(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowUserMenu(false);
      }
    };
    if (isOpen || showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showUserMenu]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleCategoryClick = (category) => {
    setShowCategorias(false);
    setIsOpen(false);
    const categoryElement = document.getElementById(`category-${category}`);
    if (categoryElement) {
      const topPosition =
        categoryElement.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/");
  };

  const handleOpenCartPreview = () => {
    if (!showCartPreview) setShowCartPreview(true);
  };

  return (
    <div className={style.container}>
      <div className={style.containerLog}>
        <p className={style.titleLog}>
          <span className={style.truck}> 🚚 </span>Envío GRATIS en compras
          mayores a $80.000
        </p>
      </div>

      <div className={`${style.containerLinks} ${isFixed ? style.fixed : ""}`}>
        <div className={style.logoContainer}>
          <img
            className={style.logo}
            src="../../../logo.png"
            alt="logo"
            onClick={handleScrollToTop}
          />
        </div>

        <div
          ref={menuRef}
          className={`${style.linkContainer} ${isOpen ? style.open : ""}`}
        >
          <IoMdClose onClick={toggleMenu} className={style.btnClose} />

          {/* Menú lateral */}
          {!isAuthenticated ? (
            <div className={style.btnLogin}>
              <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
              <FaRegUser onClick={() => navigate("/login")} />
            </div>
          ) : (
            <div className={style.userDropdownMobil}>
              <div
                className={style.userGreeting2}
                onClick={() => setShowUserMenu((prev) => !prev)}
              >
                Hola, {user?.name || "Usuario"} <MdArrowDropDown />
              </div>
              {showUserMenu && (
                <div className={`${style.dropdownMenuMobil} ${style.userGreeting}`}>
                  <button onClick={() => navigate("/orders")}>
                    Mis pedidos
                  </button>
                  <button onClick={logout}>Cerrar sesión</button>
                </div>
              )}
            </div>
          )}

          <a className={style.a} onClick={handleScrollToTop}>
            <IoHome /> Inicio
          </a>

          {!hideSearchAndCart && (
            <>
              <a
                className={style.a}
                onClick={() => {
                  const el = document.getElementById("ofertas");
                  if (el) {
                    const y =
                      el.getBoundingClientRect().top + window.pageYOffset - 200;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                <BiSolidOffer /> Ofertas
              </a>
              <a
                className={style.a}
                onClick={() => {
                  const el = document.getElementById("sobre-nosotros");
                  if (el) {
                    const y =
                      el.getBoundingClientRect().top + window.pageYOffset - 200;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                <FaUsers /> Conócenos
              </a>
              <a className={style.a} onClick={() => navigate("/send")}>
                <MdLocalShipping /> Envios
              </a>
            </>
          )}

          {!hideSearchAndCart && (
            <div className={style.categorias}>
              <div className={style.categoriasContainer}>
                <a onClick={toggleCategorias} className={style.a}>
                  <BiSolidCategory /> Categorías <MdArrowDropDown />
                </a>
              </div>
              {showCategorias && (
                <div className={style.categoriasList}>
                  {categorias.map((categoria, index) => (
                    <div
                      key={index}
                      className={style.aCategories}
                      onClick={() => handleCategoryClick(categoria)}
                    >
                      {categoria}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search + Cart + Menu (parte derecha) */}
        {!hideSearchAndCart && (
          <div className={style.search}>
            <input
              className={style.input}
              type="text"
              placeholder="Buscar productos"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IoSearch className={style.searchBtn} />
            <div
              className={style.cartContainer}
              onClick={handleOpenCartPreview}
            >
              <BsCart2 className={style.cart} />
              <div className={style.CartNumber}>
                <p>{totalProductos}</p>
              </div>
              <p className={style.totalNumber}>${total.toFixed(2)}</p>
            </div>
            <IoMenu onClick={toggleMenu} className={style.btnMenu} />
          </div>
        )}

        {/* Versión para pantallas grandes */}
        {!isAuthenticated ? (
          <div className={style.btnLogin2}>
            <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
            <FaRegUser
              className={style.logoUser}
              onClick={() => navigate("/login")}
            />
          </div>
        ) : (
          <div className={style.dropdownMenuCompu}>
            <div
              className={`${style.userGreeting} ${
                showUserMenu ? style.open : ""
              }`}
              onClick={() => setShowUserMenu((prev) => !prev)}
            >
              Hola, {user?.name || "Usuario"} <MdArrowDropDown />
            </div>
            {showUserMenu && (
              <div className={`${style.dropdownMenu} ${style.userGreeting}`}>
                <button onClick={() => navigate("/orders")}>Mis pedidos</button>
                <button onClick={logout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>

      {showArrow && (
        <div onClick={handleScrollToTop} className={style.floatingArrow}>
          <IoIosArrowDropup size={50} />
        </div>
      )}

      <a
        href="https://wa.me/542995974289"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className={style.whatsappButton}
          src="../../../whatsapp.png"
          alt="wp"
        />
      </a>

      {showCartPreview && (
        <CartPreview onClose={() => setShowCartPreview(false)} />
      )}
    </div>
  );
}

export default Nav2;
