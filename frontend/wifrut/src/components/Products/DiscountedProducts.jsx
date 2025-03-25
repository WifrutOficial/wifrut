import React from "react";
import style from "../../styles/Products.module.css";

function DiscountedProducts({ products, quantities, handleQuantityChange, handleAddToCart })
  
{
  if (!products || products.length === 0) {
    return (
      <div className={style.containerOfertas}>
        <p className={style.offOfertas}>No hay productos con descuento disponibles.</p>
      </div>
    );
  }

  return (
<>

<h3 className={style.titleOfertas}>Promociones </h3>
    <div className={style.descuento}>

      <div className={style.container2}>
        {products.map(({ _id, nombre, descuento, descripcion, tipoVenta, precioConDescuento, imagen }) => (
          <div key={_id} className={style.cartContainer}>
            <img className={style.img} src={`/${imagen}`} alt="img" />
            <p className={style.priceUnit}>
              Precio con descuento: ${precioConDescuento || 0}
            </p>
            <p className={style.description}>{descripcion || nombre}</p>

            <p className={style.quantitySelection}>Selecciona la cantidad:</p>
            <div className={style.quantityContainer}>
              <button onClick={() => handleQuantityChange(_id, tipoVenta, "decrement")}>
                -
              </button>
              <span>
                {quantities[_id] || 0} {tipoVenta === "kg" ? "kg" : "unidades"}
              </span>
              <button onClick={() => handleQuantityChange(_id, tipoVenta, "increment")}>
                +
              </button>
            </div>

            <p className={style.total}>
            Total: ${((quantities[_id] || 0) * (precioConDescuento || 0)).toFixed(2)}
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
        ))}
      </div>
    </div>
</>
  );
}

export default DiscountedProducts;
