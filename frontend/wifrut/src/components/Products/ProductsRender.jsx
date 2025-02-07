import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function ProductsRender() {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

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

  return (
    <>
      <div>
        {products.map(({ _id, nombre, precio, descripcion, tipoVenta }) => (
          <div key={_id}>
            <p>
              Precio por {tipoVenta === "kg" ? "kg" : "unidad"}: ${precio}
            </p>
            <p>Nombre: {nombre}</p>
            <p>Descripción: {descripcion}</p>

            <p>Selecciona la cantidad:</p>
            <button
              onClick={() => handleQuantityChange(_id, tipoVenta, "decrement")}
            >
              -
            </button>
            <span>
              {" "}
              {quantities[_id] || 0} {tipoVenta === "kg" ? "kg" : "unidades"}{" "}
            </span>
            <button
              onClick={() => handleQuantityChange(_id, tipoVenta, "increment")}
            >
              +
            </button>

            <p>Total: ${((quantities[_id] || 0) * precio).toFixed(2)}</p>

            <button onClick={() => handleAddToCart({ _id, nombre, precio })}>
              Añadir a carrito
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductsRender;
