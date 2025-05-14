import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import DiscountedProducts from "./DiscountedProducts";
import { IoIosArrowForward } from "react-icons/io";
import Swal from "sweetalert2";
import style from "../../styles/Products.module.css";

function ProductsRender() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();

  const categoryIcons = {
    Frutas: (
      <img
        src="../../../apple.png"
        alt="frutas"
        className={style.iconCategories}
      />
    ),
    Verduras: (
      <img
        src="../../../vegetable.png"
        alt="verduras"
        className={style.iconCategories}
      />
    ),
    Hortalizas: (
      <img
        src="../../../carrot.png"
        alt="Hortalizas"
        className={style.iconCategories}
      />
    ),
  };

  const url = `${import.meta.env.VITE_API_URL}/api/products/productos`;

  useEffect(() => {
    const getProductsBD = async () => {
      try {
        const response = await axios.get(url, { withCredentials: true });
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    getProductsBD();
  }, []);

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
        position: "center",
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
        position: "center",
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
      position: "center",
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nombre?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const categories = {};
  filteredProducts.forEach((product) => {
    const category = product.categoria || "Otro";
    if (!categories[category]) categories[category] = [];
    categories[category].push(product);
  });

  return (
    <>
      <DiscountedProducts
        products={filteredProducts.filter((p) => p.descuento)}
        handleAddToCart={handleAddToCart}
        quantities={quantities}
        handleQuantityChange={handleQuantityChange}
      />

      {Object.keys(categories).map((category) => (
        <section key={category} className={style.categorySection}>
          <div className={style.categoryContainer}>
            {categoryIcons[category] || <span />}
            <h2 className={style.categoryTitle}>{category}</h2>
          </div>

          <div className={style.carouselWrapper}>
            <button
              className={style.arrowLeft}
              onClick={() => {
                const cont = document.getElementById(`scroll-${category}`);
                cont.scrollBy({ left: -300, behavior: "smooth" });
              }}
            >
              <IoIosArrowForward
                className={style.arrowIcon}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>

            <div className={style.container} id={`scroll-${category}`}>
              {categories[category].map(
                ({ _id, nombre, precio, descripcion, tipoVenta, imagen }) => (
                  <div key={_id} className={style.cartContainer}>
                    <img className={style.img} src={`/${imagen}`} alt={nombre} />
                    <p className={style.priceUnit}>
                      Precio por {tipoVenta === "kg" ? "kg" : "unidad"}: $
                      {precio}
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
                      Total: ${((quantities[_id] || 0) * precio).toFixed(2)}
                    </p>
                    <button
                      className={style.addCart}
                      onClick={() =>
                        handleAddToCart({
                          _id,
                          nombre,
                          precio,
                          tipoVenta,
                          imagen,
                        })
                      }
                    >
                      Añadir a carrito
                    </button>
                  </div>
                )
              )}
            </div>

            <button
              className={style.arrowRight}
              onClick={() => {
                const cont = document.getElementById(`scroll-${category}`);
                cont.scrollBy({ left: 300, behavior: "smooth" });
              }}
            >
              <IoIosArrowForward className={style.arrowIcon} />
            </button>
          </div>
        </section>
      ))}
    </>
  );
}

export default ProductsRender;
