import React from "react";
import style from "../../styles/Products.module.css";
import { RiDiscountPercentFill } from "react-icons/ri";

function DiscountedProducts({
  products,
  quantities,
  handleQuantityChange,
  handleAddToCart,
}) {
  // Verifica si el array de productos está vacío o no
  if (!products || products.length === 0) {
    return (
      <div className={style.containerOfertas}>
        <p className={style.offOfertas}>
          No hay productos con descuento disponibles.
        </p>
      </div>
    );
  }

  // Filtrar productos con descuento
  const discountedProducts = products.filter((product) => product.descuento > 0);
  console.log("Productos con descuento:", discountedProducts); // Log para verificar los productos filtrados

  // Verifica si después de filtrar hay productos con descuento
  if (discountedProducts.length === 0) {
    return (
      <div className={style.containerOfertas}>
        <p className={style.offOfertas}>
          No hay productos con descuento disponibles.
        </p>
      </div>
    );
  }

  return (
    <>
      <h3 className={style.titleOfertas}>Promociones</h3>
      <div className={style.descuento}>
        <div className={style.container2}>
          {discountedProducts.map(
            ({
              _id,
              nombre,
              descuento,
              descripcion,
              tipoVenta,
              precioConDescuento,
              imagen,
            }) => (
              <div key={_id} className={style.cartContainer}>
                <img className={style.img} src={`/${imagen}`} alt="img" />
                <div className={style.saleContainer}>
                  <div className={style.sale}>
                    <RiDiscountPercentFill className={style.discount} />
                    <p>%</p>
                  </div>
                </div>
                <p className={style.priceUnit}>
                  Precio con descuento: ${precioConDescuento || 0}
                </p>
                <p className={style.description}>{descripcion || nombre}</p>

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
                  Total: $
                  {((quantities[_id] || 0) * (precioConDescuento || 0)).toFixed(
                    2
                  )}
                </p>

                <button
                  className={style.addCart}
                  onClick={() =>
                    handleAddToCart({
                      _id,
                      nombre,
                      descuento,
                      precioConDescuento,
                      tipoVenta,
                      cantidad: quantities[_id] || 0,
                    })
                  }
                >
                  Añadir a carrito
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default DiscountedProducts;
