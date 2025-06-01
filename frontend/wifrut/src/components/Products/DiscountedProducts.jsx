import { IoIosArrowForward } from "react-icons/io";
import style from "../../styles/Products.module.css";

function DiscountedProducts({
  products,
  quantities,
  handleQuantityChange,
  handleAddToCart,
}) {

  const isKg = (tipoVenta) =>
    String(tipoVenta || "")
      .toLowerCase()
      .includes("kilo");

  const discountedProducts = products.filter(
    (product) => Number(product.descuento) > 0
  );

  if (discountedProducts.length === 0) {
    return (
      <div>
        <p className={style.offOfertas}>
          No hay productos con descuento disponibles.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={style.containerOfertas}>
        <p className={style.iconOfertas}>
          <img src="../../../ofertasIcon.png" alt="" />
        </p>
        <h3 id="ofertas" className={style.titleOfertas}>
          OFERTAS
        </h3>
      </div>

      <div className={style.descuento}>
   
        <button
          className={style.arrowLeft}
          onClick={() => {
            const cont = document.getElementById("scroll-ofertas");
            if (cont) cont.scrollBy({ left: -300, behavior: "smooth" });
          }}
        >
          <IoIosArrowForward
            className={style.arrowIcon}
            style={{ transform: "rotate(180deg)" }}
          />
        </button>

    
        <div id="scroll-ofertas" className={style.container}>
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
                <img className={style.img} src={`/${imagen}`} alt={nombre} />

          
                <div className={style.discountBadge}>{descuento}%</div>

                <div className={style.sale}>
                  <img src="../../../Star 1.png" alt="sale" />
                  <p>%</p>
                </div>

                <p className={style.priceUnit}>
                  Precio: ${precioConDescuento?.toFixed(2) || "0.00"}{" "}
                   {isKg(tipoVenta) ? "kg" : "unidad"}
                </p>

                <p className={style.productName}>{nombre}</p>
                {descripcion && (
                  <p className={style.description}>{descripcion}</p>
                )}

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
                    {quantities[_id] || 0} {isKg(tipoVenta) ? "kg" : "unidad"}
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
                  )}{" "}
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
                      imagen,
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
   
        <button
          className={style.arrowRight}
          onClick={() => {
            const cont = document.getElementById("scroll-ofertas");
            if (cont) cont.scrollBy({ left: 300, behavior: "smooth" });
          }}
        >
          <IoIosArrowForward className={style.arrowIcon} />
        </button>
      </div>
    </>
  );
}

export default DiscountedProducts;
