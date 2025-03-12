import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Products.module.css";
import { useSearch } from "../../context/SearchContext";
import DiscountedProducts from "./DiscountedProducts";

function ProductsRender() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();
  const [visibleCount, setVisibleCount] = useState(11);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const getProductsBD = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products/productos");
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    getProductsBD();
  }, [selectedCategory]);

  const handleQuantityChange = (productId, tipoVenta, action) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 0;
      let newQty = currentQty;
      if (action === "increment") {
        newQty = tipoVenta === "kg" ? currentQty + 0.5 : currentQty + 1;
      } else if (action === "decrement" && currentQty > 0) {
        newQty = tipoVenta === "kg" ? Math.max(0, currentQty - 0.5) : Math.max(0, currentQty - 1);
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }
    const cantidad = quantities[product._id] || 0;
    if (cantidad === 0) {
      alert("Debes seleccionar una cantidad.");
      return;
    }
    addToCart({ ...product, tipoVenta: product.tipoVenta || "Unidad" }, cantidad);
    alert("Producto agregado al carrito")
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? "" : category));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nombre?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria?.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    return matchesSearch && matchesCategory;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const productsWithDiscount = visibleProducts.filter((product) => product.descuento);
  const productsWithoutDiscount = visibleProducts.filter((product) => !product.descuento);

  return (
    <>
      <DiscountedProducts
        products={productsWithDiscount}
        handleAddToCart={handleAddToCart}
        quantities={quantities}
        handleQuantityChange={handleQuantityChange}
      />

      <div className={style.containerCategory}>
        <button className={selectedCategory === "" ? style.activeCategory : ""} onClick={() => setSelectedCategory("")}>
          Todos los productos
        </button>
        {["Hortalizas de hoja",
          "Hortalizas de raiz y tuberculos",
          "Hortalizas de frutos",
          "Hortalizas de tallo, brotes y legumbres frescas",
          "Frutas y Citricos",
          "Frutas de carozo y pepita",
          "Frutas tropicales y del Bosque",
          "Frutas Melon sandia y uvas",
          "Hongos, especies y aromaticas frescas",].map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? style.activeCategory : ""}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <h2 className={style.title}>{selectedCategory ? selectedCategory : "Nuestros Productos"}</h2>
      <div className={style.container}>
        {productsWithoutDiscount.map(({ _id, nombre, precio, descripcion, tipoVenta }) => (
          <div key={_id} className={style.cartContainer}>
            <img className={style.img} src="../../../producto.png" alt="img" />
            <p className={style.priceUnit}>Precio por {tipoVenta === "kg" ? "kg" : "unidad"}: ${precio}</p>
            <p className={style.description}>{descripcion || nombre}</p>
            <p className={style.quantitySelection}>Selecciona la cantidad:</p>
            <div className={style.quantityContainer}>
              <button onClick={() => handleQuantityChange(_id, tipoVenta, "decrement")}>-</button>
              <span>{quantities[_id] || 0} {tipoVenta === "kg" ? "kg" : "unidades"}</span>
              <button onClick={() => handleQuantityChange(_id, tipoVenta, "increment")}>+</button>
            </div>
            <p className={style.total}>Total: ${((quantities[_id] || 0) * precio).toFixed(2)}</p>
            <button className={style.addCart} onClick={() => handleAddToCart({ _id, nombre, precio, tipoVenta })}>
              Añadir a carrito
            </button>
          </div>
        ))}
      </div>

      <div className={style.containerseeMoreBtn}>
        {visibleCount < filteredProducts.length ? (
          <button onClick={() => setVisibleCount((prev) => prev + 8)} className={style.seeMoreBtn}>
            Ver más
          </button>
        ) : (
          <p className={style.seeMoreBtnNo}>Ya no hay más productos para mostrar</p>
        )}

        {visibleCount > 11 && (
          <button onClick={() => setVisibleCount((prev) => Math.max(prev - 8, 11))} className={style.seeMoreBtn}>
            Ver menos
          </button>
        )}
      </div>
    </>
  );
}

export default ProductsRender;