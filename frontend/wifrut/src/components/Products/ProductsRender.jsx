import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import style from "../../styles/Products.module.css";
import { useSearch } from "../../context/SearchContext";

function ProductsRender() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();
  const [visibleCount, setVisibleCount] = useState(8);

  //obtencion de productos de bd
  useEffect(() => {
    const getProductsBD = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/products/productos"
        );

        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    getProductsBD();
  }, []);

  //funcion de manejo de cambio de cantidades
  const handleQuantityChange = (productId, tipoVenta, action) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 0;
      let newQty = currentQty;

      if (action === "increment") {
        newQty = tipoVenta === "kg" ? currentQty + 0.5 : currentQty + 1;
      } else if (action === "decrement" && currentQty > 0) {
        newQty = tipoVenta === "kg" ? currentQty - 0.5 : currentQty - 1;
      }

      return { ...prev, [productId]: newQty };
    });
  };

  // Función para añadir al carrito
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
    addToCart(product, cantidad);
    alert("Producto agregado al carrito");
  };
  
  //funcion para filtrar productos segun la busqueda
  const filteredProducts = searchQuery
  ? products.filter((product) =>
    (product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.nombre?.toLowerCase().includes(searchQuery.toLowerCase()))
  )
: products;
     // Obtener los productos visibles
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <>
      <h2 className={style.title}>Nuestros Productos</h2>
      <div className={style.container}>
        {visibleProducts.map(({ _id, nombre, precio, descripcion, tipoVenta }) => (
          <div key={_id} className={style.cartContainer}>
            <img className={style.img} src="../../../producto.png" alt="img" />
            <p className={style.priceUnit}>
              Precio por {tipoVenta === "kg" ? "kg" : "unidad"}: ${precio}
            </p>
            <p className={style.description}>{descripcion || nombre }</p>

            <p className={style.quantitySelection}>Selecciona la cantidad:</p>
            <div className={style.quantityContainer}>
              <button
                onClick={() =>
                  handleQuantityChange(_id, tipoVenta, "decrement")
                }
              >
                -
              </button>
              <span>
                {" "}
                {quantities[_id] || 0} {tipoVenta === "kg" ? "kg" : "unidades"}{" "}
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
              onClick={() => handleAddToCart({ _id, nombre, precio })}
            >
              Añadir a carrito
            </button>
          </div>
        ))}
     
      </div>
      <div className={style.containerseeMoreBtn}>
          <button   onClick={() => setVisibleCount((prev) => prev + 8)}   className={style.seeMoreBtn}>Ver más</button>
      </div>
       
    </>
  );
}

export default ProductsRender;
