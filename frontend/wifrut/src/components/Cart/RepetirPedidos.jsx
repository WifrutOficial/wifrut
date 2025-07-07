import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import style from "../../styles/RepetirPedido.module.css";
import formatNumber from "../../utils/formatNumber";

const estadoLegible = {
  pendiente: { texto: "Pendiente", color: "#d9d9d9", icono: "⏳" },
  procesando: { texto: "Recibido", color: "#ffe58f", icono: "📦" },
  enviado: { texto: "En viaje", color: "#91d5ff", icono: "🚚" },
  entregado: { texto: "Entregado", color: "#95de64", icono: "✅" },
};

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
          axios.get(`${import.meta.env.VITE_API_URL}/api/order/repetir-pedido`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/products/productos`, { withCredentials: true }),
        ]);

        if (Array.isArray(pedidosRes.data) && Array.isArray(productosRes.data)) {
          const productos = productosRes.data;

          const pedidosConImagenes = pedidosRes.data.map((pedido) => ({
            ...pedido,
            items: pedido.items.map((item) => {
              const productoEncontrado = productos.find((p) => p.nombre === item.nombre);
              return {
                ...item,
                imagen: productoEncontrado?.imagen || "",
                _id: productoEncontrado?._id || "",
                tipoVenta: productoEncontrado?.tipoVenta || "Unidad",
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
        <div className={style.spinner}></div>
        <p>Cargando</p>
      </div>
    );
  }

  if (!pedidos.length) {
    return (
      <div className={style.container}>
        <button className={style.botonVolver} onClick={() => navigate("/")}>
          ← Regresar a la página principal
        </button>
        <p className={style.emptyMessage}>No hay pedidos para mostrar</p>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <button className={style.botonVolver} onClick={() => navigate("/")}>
        ← Regresar a la página principal
      </button>
      <h2 className={style.h2}>Historial de Pedidos</h2>

      {pedidos.map((pedido, index) => {
        const estado = estadoLegible[pedido.status] || { texto: "Desconocido", color: "#ccc", icono: "❓" };
        const fecha = new Date(pedido.createdAt).toLocaleDateString("es-AR");
        const pedidoNumero = pedidos.length - index;

        return (
          <div key={index} className={style.cardPedido}>
            <div className={style.headerPedido}>
              <h4>Pedido #{pedidoNumero}</h4>
              <span className={style.estadoPedido} style={{ backgroundColor: estado.color }}>
                {estado.icono} {estado.texto}
              </span>
            </div>

            <p className={style.fechaPedido}>📜 Pedido realizado el: {fecha}</p>

            <div className={style.listaItems}>
              {pedido.items.map((item, i) => {
                const qty = item.cantidad ?? item.quantity ?? 1;
                return (
                  <div className={style.itemProducto} key={i}>
                    <img src={item.imagen} alt={item.nombre} className={style.imagenProducto} />
                    <div className={style.detalleProducto}>
                      <p><strong>{item.nombre}</strong></p>
                      <p>{qty} {item.tipoVenta}</p>
                      <p>${formatNumber(Number(item.precio) * qty)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className={style.totalPedido}>
              <strong>Total del pedido:</strong> ${formatNumber(Number(pedido.total))}
            </p>

            <div className={style.footerPedido}>
              <button className={style.btnRepetir} onClick={() => handleRepetir(pedido)}>
                Repetir pedido
                <img src="/repetir.png" alt="repetir" className={style.repetirIcono} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RepetirPedidos;
