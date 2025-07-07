// src/components/DiscountedProducts.js
import { IoIosArrowForward } from "react-icons/io";
import style from "../../styles/Products.module.css";
import formatNumber from "../../utils/formatNumber";

function DiscountedProducts({
  products,
  quantities,
  handleQuantityChange,
  handleAddToCart,
}) {
  const isKg = (tipoVenta) =>
    String(tipoVenta || "").toLowerCase().includes("kilo");

  const getKiloMinimo = (product) => {
    if (product.kiloMinimo && isKg(product.tipoVenta)) {
      const parsed = Number(product.kiloMinimo);
      return isNaN(parsed) ? 1 : parsed;
    }
    return isKg(product.tipoVenta) ? 1 : 1; // default mínimo
  };

  const discountedProducts = products.filter(
    (product) => Number(product.descuento) > 0
  );

  if (discountedProducts.length === 0) {
    return (
      <div>
        <p className={style.offOfertas}>
          No hay ofertas en este momento.
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
            (product) => {
              const {
                _id,
                nombre,
                descuento,
                descripcion,
                tipoVenta,
                precioConDescuento,
                imagen,
              } = product;

              const quantity = quantities[_id] || 0;
              const kiloMin = getKiloMinimo(product);
              const roundedQuantity = isKg(tipoVenta)
                ? Math.max(Math.floor(quantity / kiloMin) * kiloMin, kiloMin)
                : quantity;

              return (
                <div key={_id} className={style.cartContainer}>
                  <img className={style.img} src={`/${imagen}`} alt={nombre} />

                  <div className={style.discountBadge}>{descuento}%</div>

                  <div className={style.sale}>
                    <img src="../../../Star 1.png" alt="sale" />
                    <p>%</p>
                  </div>

                  <p className={style.priceUnit}>
                    Precio: ${formatNumber(precioConDescuento) || "0,00"}{" "}
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
                        handleQuantityChange(_id, tipoVenta, "decrement", kiloMin)
                      }
                    >
                      -
                    </button>
                    <span>
                      {roundedQuantity} {isKg(tipoVenta) ? "kg" : "unidad"}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(_id, tipoVenta, "increment", kiloMin)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className={style.total}>
                    Total: $
                    {formatNumber(roundedQuantity * (precioConDescuento || 0))}
                  </p>

                  <button
                    className={style.addCart}
                    onClick={() => {
                      if (roundedQuantity < kiloMin) return;
                      handleAddToCart({
                        _id,
                        nombre,
                        descuento,
                        precioConDescuento,
                        tipoVenta,
                        imagen,
                        cantidad: roundedQuantity,
                      });
                    }}
                  >
                    Añadir a carrito
                  </button>
                </div>
              );
            }
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