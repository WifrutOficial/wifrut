import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Products.module.css";
import { useSearch } from "../../context/SearchContext";
import DiscountedProducts from "./DiscountedProducts";
import { BiSolidRightArrow } from "react-icons/bi";
import Swal from "sweetalert2";

function ProductsRender() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();
  const [visibleCount, setVisibleCount] = useState(8); // Solo para productos sin descuento
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openCategory, setOpenCategory] = useState("");

  useEffect(() => {
    const getProductsBD = async () => {
      try {
        console.log("API URL PRODUCTOSSS:", import.meta.env.VITE_API_URL);
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
        title: "¡Error!",
        text: "Debes iniciar sesión para comprar.",
        icon: "warning",
        confirmButtonColor: "#B90003",
        customClass: {
          popup: style.customAlert,
          icon: style.customIconErr,
        },
      });
      return;
    }
    const cantidad = quantities[product._id] || 0;
    if (cantidad === 0) {
      Swal.fire({
        title: "¡Error!",
        text: "Debes seleccionar una cantidad.",
        icon: "warning",
        confirmButtonColor: "#B90003",
        customClass: {
          popup: style.customAlert,
          icon: style.customIconErr,
        },
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
      confirmButtonColor: "#004718",
      customClass: {
        popup: style.customAlert,
        icon: style.customIconSuc,
      },
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? "" : category
    );
  };

  const toggleSubCategory = (category) => {
    setOpenCategory(openCategory === category ? "" : category);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nombre?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      product.categoria?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim();
    return matchesSearch && matchesCategory;
  });

  // Separamos productos con y sin descuento
  const productsWithDiscount = filteredProducts.filter(
    (product) => product.descuento
  );
  const productsWithoutDiscount = filteredProducts.filter(
    (product) => !product.descuento
  );
  const visibleProductsWithoutDiscount = productsWithoutDiscount.slice(
    0,
    visibleCount
  );

  return (
    <>
      {/* Mostrar todos los productos con descuento sin paginación */}
      <DiscountedProducts
        products={productsWithDiscount} // Pasamos todos los productos con descuento
        handleAddToCart={handleAddToCart}
        quantities={quantities}
        handleQuantityChange={handleQuantityChange}
      />

      <div className={style.containerCategory}>
        <button
          className={selectedCategory === "" ? style.activeCategory : ""}
          onClick={() => setSelectedCategory("")}
        >
          Todos los productos
        </button>

        {/* Hortalizas */}
        <div className={style.hortalizas}>
          <button
            onClick={() => toggleSubCategory("Hortalizas")}
            className={style.categoryTitle}
          >
            Hortalizas
          </button>
          {openCategory === "Hortalizas" && (
            <div className={style.subCategoryContainer}>
              <BiSolidRightArrow className={style.arrow} />
              {[
                "Hortalizas de hoja",
                "Hortalizas de raiz y tuberculos",
                "Hortalizas de frutos",
                "Hortalizas de tallo, brotes y legumbres frescas",
              ].map((subcategory) => (
                <button
                  key={subcategory}
                  className={
                    selectedCategory === subcategory ? style.activeCategory : ""
                  }
                  onClick={() => handleCategoryClick(subcategory)}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Frutas */}
        <div className={style.Frutas}>
          <button
            onClick={() => toggleSubCategory("Frutas")}
            className={style.categoryTitle}
          >
            Frutas
          </button>
          {openCategory === "Frutas" && (
            <div className={style.subCategoryContainer}>
              <BiSolidRightArrow className={style.arrow} />
              {[
                "Frutas y Citricos",
                "Frutas de carozo y pepita",
                "Frutas tropicales y del Bosque",
                "Frutas Melon sandia y uvas",
              ].map((subcategory) => (
                <button
                  key={subcategory}
                  className={
                    selectedCategory === subcategory ? style.activeCategory : ""
                  }
                  onClick={() => handleCategoryClick(subcategory)}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Frutas */}
        <div className={style.Frutas}>
          <button
            
            className={style.categoryTitle}
          >
           Congelados
          </button>
       
        </div>
      </div>

      <h2 className={style.title}>
        {selectedCategory ? selectedCategory : "Nuestros Productos"}
      </h2>
      <div className={style.container}>
        {visibleProductsWithoutDiscount.map(
          ({ _id, nombre, precio, descripcion, tipoVenta, imagen }) => {
            return (
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
                  Total: ${((quantities[_id] || 0) * precio).toFixed(2)}
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
            );
          }
        )}
      </div>

      {/* Botones Ver más/Ver menos solo para productos sin descuento */}
      <div className={style.containerseeMoreBtn}>
        {visibleCount < productsWithoutDiscount.length ? (
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className={style.seeMoreBtn}
          >
            Ver más
          </button>
        ) : (
          <p className={style.seeMoreBtnNo}>
            Ya no hay más productos para mostrar
          </p>
        )}

        {visibleCount > 9 && (
          <button
            onClick={() => setVisibleCount((prev) => Math.max(prev - 8, 9))}
            className={style.seeMoreBtn}
          >
            Ver menos
          </button>
        )}
      </div>
    </>
  );
}

export default ProductsRender;
