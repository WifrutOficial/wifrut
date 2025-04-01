import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Products.module.css";
import { useSearch } from "../../context/SearchContext";
import DiscountedProducts from "./DiscountedProducts";
import { MdPlayArrow } from "react-icons/md";
import Swal from "sweetalert2";

function ProductsRender() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();
  const categoryRefs = useRef({}); // Referencias dinámicas para cada categoría

  useEffect(() => {
    const getProductsBD = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/productos`,
          { withCredentials: true }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    getProductsBD();
  }, []);

  // Desplazarse a la categoría con un offset de 20px más arriba
  useEffect(() => {
    if (searchQuery && categoryRefs.current[searchQuery]) {
      const categoryElement = categoryRefs.current[searchQuery];
      const topPosition =
        categoryElement.getBoundingClientRect().top +
        window.scrollY -
        140; // Restamos 20px para frenar más arriba
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
    }
  }, [searchQuery]);

  const handleQuantityChange = (productId, tipoVenta, action) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 0;
      let newQty = currentQty;
      if (action === "increment") {
        newQty = tipoVenta === "kg" ? currentQty + 0.5 : currentQty + 1;
      } else if (action === "decrement" && currentQty > 0) {
        newQty =
          tipoVenta === "kg"
            ? Math.max(0, currentQty - 0.5)
            : Math.max(0, currentQty - 1);
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      Swal.fire({
        text: "Debes iniciar sesión.",
        icon: "warning",
        customClass: {
          popup: style.customAlert,
          icon: style.customIconErr,
        },
        position: "bottom-start",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    const cantidad = quantities[product._id] || 0;
    if (cantidad === 0) {
      Swal.fire({
        text: "Debes seleccionar una cantidad.",
        icon: "warning",
        customClass: {
          popup: style.customAlert,
          icon: style.customIconErr,
        },
        position: "bottom-start",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    addToCart(
      { ...product, tipoVenta: product.tipoVenta || "Unidad" },
      cantidad
    );

    Swal.fire({
      text: "Producto agregado al carrito",
      icon: "success",
      customClass: {
        popup: style.customAlert,
        icon: style.customIconSuc,
      },
      position: "bottom-start",
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  // Agrupar productos por categoría sin filtrar
  const categories = {};
  products.forEach((product) => {
    const category = product.categoria || "Otro";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(product);
  });

  return (
    <>
      <DiscountedProducts
        products={products.filter((product) => product.descuento)}
        handleAddToCart={handleAddToCart}
        quantities={quantities}
        handleQuantityChange={handleQuantityChange}
      />

      {Object.keys(categories).map((category) => (
        <div
          key={category}
          ref={(el) => (categoryRefs.current[category] = el)} // Asignar ref dinámicamente
        >
          <div className={style.categoryContainer}>
            <MdPlayArrow />
            <h2 className={style.categoryTitle}>{category}</h2>
          </div>
          <div className={style.container}>
            {categories[category].map(
              ({ _id, nombre, precio, descripcion, tipoVenta, imagen }) => (
                <div key={_id} className={style.cartContainer}>
                  <img className={style.img} src={`/${imagen}`} alt="img" />
                  <p className={style.priceUnit}>
                    Precio por {tipoVenta === "kg" ? "kg" : "unidad"}: ${precio}
                  </p>
                  <p className={style.description}>{descripcion || nombre}</p>
                  <p className={style.quantitySelection}>
                    Selecciona la cantidad:
                  </p>
                  <div className={style.quantityContainer}>
                    <button
                      onClick={() =>
                        handleQuantityChange(_id, tipoVenta, "decrement")
                      }
                    >
                      -
                    </button>
                    <span>
                      {quantities[_id] || 0}{" "}
                      {tipoVenta === "kg" ? "kg" : "unidades"}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(_id, tipoVenta, "increment")
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className={style.total}>
                    Total: ${(quantities[_id] || 0) * precio.toFixed(2)}
                  </p>
                  <button
                    className={style.addCart}
                    onClick={() =>
                      handleAddToCart({ _id, nombre, precio, tipoVenta })
                    }
                  >
                    Añadir a carrito
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductsRender;