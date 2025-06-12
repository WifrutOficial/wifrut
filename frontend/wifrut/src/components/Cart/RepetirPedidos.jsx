import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import style from "../../styles/RepetirPedido.module.css";
import { IoIosArrowDropleft } from "react-icons/io";

function RepetirPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidosYProductos = async () => {
      setLoading(true);
      try {
        const [pedidosRes, productosRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/order/repetir-pedido`,
            {
              withCredentials: true,
            }
          ),
          axios.get(`${import.meta.env.VITE_API_URL}/api/products/productos`), {
              withCredentials: true,
            }
        ]);

        if (
          Array.isArray(pedidosRes.data) &&
          Array.isArray(productosRes.data)
        ) {
          const productos = productosRes.data;

          const pedidosConImagenes = pedidosRes.data.map((pedido) => ({
            ...pedido,
            items: pedido.items.map((item) => {
              const productoEncontrado = productos.find(
                (p) => p.nombre === item.nombre
              );
              return {
                ...item,
                imagen: productoEncontrado?.imagen || "",
                _id: productoEncontrado?._id || "",
                tipoVenta: productoEncontrado?.tipoVenta || 'Unidad',
              };
            }),
          }));

          setPedidos(pedidosConImagenes);
        }
      } catch (error) {
        console.error("Error al traer pedidos o productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidosYProductos();
  }, []);

  const handleRepetir = (pedido) => {
    const itemsConNumeros = pedido.items.map((item) => ({
      _id: item._id,
      nombre: item.nombre,
      precio: Number(item.precio),
      quantity: Number(item.cantidad ?? item.quantity ?? 1),
      imagen: item.imagen,
      tipoVenta: item.tipoVenta, 
    }));

    setCart(itemsConNumeros);

    navigate("/cart", {
      state: {
        direccion: pedido.direccion,
        turno: pedido.turno,
        total: Number(pedido.total),
        metodoPago: pedido.metodoPago,
        numeroPedido: pedido.numeroPedido,
        status: pedido.status,
        paymentStatus: pedido.paymentStatus,
      },
    });
  };

  if (loading) {
    return (
      <div className={style.containerspinner}>
       
        <div className={style.spinner}></div> <p>Cargando</p>
      </div>
    );
  }

  if (!pedidos.length) {
    return (
      <div className={style.container}>
        <div className={style.containerTotal}>
          <IoIosArrowDropleft
            className={style.arrow}
            onClick={() => navigate("/")}
          />
          <div className={style.emptyContainer}>
            <p className={style.emptyMessage}>No hay pedidos para mostrar</p>
          </div>
        </div>
        <button className={style.backHomeButton} onClick={() => navigate("/")}>
          ← Regresar a la página principal
        </button>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.containerTotal}>
        <IoIosArrowDropleft
          className={style.arrow}
          onClick={() => navigate("/")}
        />
        <h2 className={style.h2}>Historial de Pedidos</h2>
        {pedidos
          .slice()
          .reverse()
          .map((pedido, index) => (
            <div
              key={index}
              className={style.containerPedido}
              style={{ border: "1px solid #ccc" }}
            >
              <h4 className={style.h4}>Pedido #{pedidos.length - index}</h4>
              <div>
                {pedido.items.map((item, i) => {
                  const qty = item.cantidad ?? item.quantity ?? 1;
                  return (
                    <div className={style.containerProducts} key={i}>
                      <div>
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className={style.imagenProducto}
                        />
                      </div>
                      <div>
                        <p>
                          <strong>Producto:</strong> {item.nombre}
                        </p>
                        <p>
                          <strong>Precio Unidad:</strong> ${item.precio}
                        </p>
                        <p>
                          <strong>Cantidad:</strong> {qty}
                        </p>
                        <p>
                          <strong>Precio Total:</strong> $
                          {(Number(item.precio) * Number(qty)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                className={style.btn}
                onClick={() => handleRepetir(pedido)}
              >
                <p className={style.text}> Repetir</p>
                <img
                  className={style.repetir}
                  src="/repetir.png"
                  alt="repetir"
                />
              </button>
            </div>
          ))}
      </div>
      <button className={style.backHomeButton} onClick={() => navigate("/")}>
        ← Regresar a la página principal
      </button>
    </div>
  );
}

export default RepetirPedidos;
