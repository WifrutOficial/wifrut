import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import DiscountedProducts from "./DiscountedProducts";
import { IoIosArrowForward } from "react-icons/io";
import Swal from "sweetalert2";
import style from "../../styles/Products.module.css";

function ProductsRender() {
  const redondear = (valor) => Math.round(valor * 100) / 100;
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();
  const [loading, setLoading] = useState(true);
  const productsContainerRef = useRef(null);

  const categoryIcons = {
    Frutas: (
      <img src="../../../apple.png" alt="frutas" className={style.iconCategories} />
    ),
    Verduras: (
      <img src="../../../vegetable.png" alt="verduras" className={style.iconCategories} />
    ),
    Hortalizas: (
      <img src="../../../carrot.png" alt="Hortalizas" className={style.iconCategories} />
    ),
    Gourmet: (
      <img src="../../../mushrooms.png" alt="Gourmet" className={style.iconCategories} />
    ),
    Congelados: (
      <img src="../../../congelados.png" alt="Congelados" className={style.iconCategories} />
    ),
    Canastas: (
      <img src="../../../canasta.png" alt="Canastas" className={style.iconCategories} />
    ),
  };

  const url = `${import.meta.env.VITE_API_URL}/api/products/productos`;

  useEffect(() => {
    const getProductsBD = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, { withCredentials: true });
        const fetchedProducts = response.data;
        setProducts(fetchedProducts);

        const initialQuantities = {};
        fetchedProducts.forEach(product => {
          if (product.tipoVenta && product.tipoVenta.toLowerCase().includes("kilo")) {
            initialQuantities[product._id] = product.kiloMinimo || 0.5;
          } else {
            initialQuantities[product._id] = 1;
          }
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    getProductsBD();
  }, [url]);

  const isKg = (tipoVenta) => {
    return tipoVenta && tipoVenta.toLowerCase().includes("kilo");
  };

const handleQuantityChange = (productId, tipoVenta, action, kiloMinimo) => {
  const minimo = Number(kiloMinimo) || 0.5;

  setQuantities((prev) => {
    const currentQty = prev[productId] || 0;
    let newQty = currentQty;

    if (isKg(tipoVenta)) {
      if (action === "increment") {
        newQty = redondear(currentQty + minimo);
      } else if (action === "decrement") {
        if (currentQty - minimo >= minimo) {
          newQty = redondear(currentQty - minimo);
        }
      }
    } else {
      if (action === "increment") {
        newQty = redondear(currentQty + 1);
      } else if (action === "decrement") {
        if (currentQty > 1) {
          newQty = redondear(currentQty - 1);
        }
      }
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

  useEffect(() => {
    if (searchQuery && productsContainerRef.current) {
      productsContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [searchQuery]);

  const filteredProducts = products.filter((product) => {
    const q = searchQuery?.toLowerCase();
    return (
      !q ||
      product.descripcion?.toLowerCase().includes(q) ||
      product.nombre?.toLowerCase().includes(q)
    );
  });

  const productsWithoutDiscount = filteredProducts.filter((p) => !p.descuento);

  const categories = {};
productsWithoutDiscount.forEach((product) => {
  const cat = product.categoria || "Otro";
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(product);
});

// Ordenar productos por nombre dentro de cada categoría
Object.keys(categories).forEach((cat) => {
  categories[cat].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
});
  if (loading) {
    return (
      <div className={style.loadingBtn}>
        <button disabled className={style.registerBtn}>
          <div className={style.spinner} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div ref={productsContainerRef} />

      <DiscountedProducts
        products={filteredProducts.filter((p) => p.descuento)}
        handleAddToCart={handleAddToCart}
        quantities={quantities}
        handleQuantityChange={handleQuantityChange}
      />

      {Object.entries(categories).map(([categoria, items]) => (
        <section key={categoria} className={style.categorySection}>
          <div className={style.categoryContainer}>
            {categoryIcons[categoria] || <span />}
            <h2 className={style.categoryTitle}>{categoria}</h2>
          </div>

          <div className={style.carouselWrapper}>
            <button
              className={style.arrowLeft}
              onClick={() =>
                document
                  .getElementById(`scroll-${categoria}`)
                  .scrollBy({ left: -300, behavior: "smooth" })
              }
            >
              <IoIosArrowForward
                className={style.arrowIcon}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>

            <div className={style.container} id={`scroll-${categoria}`}>
              {[...items]
                .sort((a, b) => {
                  if (a.stock === 0 && b.stock > 0) return 1;
                  if (a.stock > 0 && b.stock === 0) return -1;
                  return 0;
                })
                .map(
                  ({
                    _id,
                    nombre,
                    precio,
                    descripcion,
                    tipoVenta,
                    imagen,
                    kiloMinimo,
                    stock,
                  }) => (
                    <div key={_id} className={`${style.cartContainer} ${stock === 0 ? style.disabledProduct : ''}`}>
                      <img className={style.img} src={`/${imagen}`} alt={nombre} />

                      <p className={style.priceUnit}>
                        Precio: ${precio} {isKg(tipoVenta) ? "kg" : "unidad"}
                      </p>

                      <p className={style.productName}>{nombre}</p>

                      {descripcion && (
                        <p className={style.description}>{descripcion}</p>
                      )}

                      {stock > 0 ? (
                        <>
                          <p className={style.quantitySelection}>
                            Selecciona la cantidad:
                          </p>
                          <div className={style.quantityContainer}>
                            <button
                              onClick={() =>
                                handleQuantityChange(_id, tipoVenta, "decrement", kiloMinimo)
                              }
                            >
                              -
                            </button>

                            <span>
                              {quantities[_id] || 0} {isKg(tipoVenta) ? "kg" : "unidades"}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(_id, tipoVenta, "increment", kiloMinimo)
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
                        </>
                      ) : (
                        <div className={style.sinStockContainer}>
                          <p className={style.sinStockText}>SIN STOCK</p>
                        </div>
                      )}
                    </div>
                  )
                )}
            </div>

            <button
              className={style.arrowRight}
              onClick={() =>
                document
                  .getElementById(`scroll-${categoria}`)
                  .scrollBy({ left: 300, behavior: "smooth" })
              }
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
