import axios from "axios";
import { useState } from "react";
import style from "../../../../styles/BuscarPedidos.module.css";
import formatNumber from "../../../../utils/formatNumber";

function BuscarPedidos() {
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const isKg = (tipoVenta) => tipoVenta && tipoVenta.toLowerCase().includes("kilo");

  const fetchOrdersByDate = async () => {
    if (!date) return alert("Selecciona una fecha");
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/whatsapp/ordersByDate?date=${date}`,
        { withCredentials: true }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      alert("Error al obtener pedidos");
    } finally {
      setLoading(false);
    }
  };

const cambiarEstadoPedido = async (id, nuevoEstado) => {
  try {
    console.log("🔄 Llamando a la API con:", { id, nuevoEstado });

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/order/estado`,
      { id, nuevoEstado },
      { withCredentials: true }
    );

    console.log("✅ Respuesta del backend:", response.data);
    fetchOrdersByDate();
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
};


  const resumenProductos = {};
  let totalDelDia = 0;

  orders.forEach((order) => {
    totalDelDia += order.total;

    order.items.forEach((item) => {
      const nombre = item.nombre || "desconocido";
      const tipo = isKg(item?.productId?.tipoVenta) ? "kg" : "u.";
      const key = `${nombre}__${tipo}`;
      resumenProductos[key] = (resumenProductos[key] || 0) + item.cantidad;
    });
  });

  const estadoLegible = {
    pendiente: "Pendiente",
    procesando: "Pagado",
    enviado: "En viaje",
    entregado: "Entregado",
  };

  const estadoOpciones = [
    { label: "Pagado", value: "procesando" },
    { label: "En viaje", value: "enviado" },
    { label: "Entregado", value: "entregado" },
  ];

  return (
    <div>
      <h2 className={style.title}>Buscar pedidos por fecha</h2>
      <div className={style.container}>
        <div className={style.search}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={fetchOrdersByDate}>Buscar</button>
        </div>

        <h3 className={style.title}>Resultados</h3>

        <div className={style.containerInfo}>
          {loading ? (
            <div className={style.spinner}></div>
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const {
                total,
                direccion,
                metodoPago,
                status,
                fechaEntrega,
                items,
                turno,
              } = order;
                          
              const phone = order?.userId?.phone || "No disponible";
              const email = order?.userId?.email || "No disponible";
              const name = order?.userId?.nombre || "No disponible";

              return (
                <div
                  className={style.containerItems}
                  key={order._id}
                  onClick={() => !selectedOrder && setSelectedOrder(order)}
                >
                  <div className={style.infoPedido}>
                    <div className={style.info1}>
                      <p><span>Total:</span> ${formatNumber(total)}</p>
                      <p><span>Dirección:</span> {direccion}</p>
                      <p><span>Pago:</span> {metodoPago}</p>
                      <p><span>Turno:</span> {turno}</p>
                    </div>
                    <div className={style.info1}>
                      <p><span>Estado:</span> {estadoLegible[status]}</p>
                      <p><span>Fecha:</span> {(fechaEntrega)}</p>
                      <p><span>Nombre:</span> {name}</p>
                      <p><span>Teléfono:</span> {phone}</p>
                      <p><span>Email:</span> {email}</p>
                    </div>
                  </div>

                  <div className={style.botonesEstado}>
                    {estadoOpciones.map((opcion) => (
                      <button
                        key={opcion.value}
                        onClick={() => cambiarEstadoPedido(order._id, opcion.value)}
                        disabled={status === opcion.value}
                        className={status === opcion.value ? style.botonActivo : ""}
                      >
                        {opcion.label}
                      </button>
                    ))}
                  </div>

                  <div className={style.productosPedido}>
                    <p className={style.title}>Productos del pedido:</p>
                    <ul className={style.infoProducto}>
                      {items.map((item, index) => (
                        <li key={index}>
                          {item.nombre || "desconocido"}: {item.cantidad}{" "}
                          {isKg(item.productId?.tipoVenta) ? "kg" : "u."}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No hay pedidos para esta fecha.</p>
          )}
        </div>

        {orders.length > 0 && (
          <div className={style.resumen}>
            <h3 className={style.title}>Total de Productos:</h3>
            {Object.entries(resumenProductos).map(([key, cantidad]) => {
              const [nombre, tipo] = key.split("__");
              return (
                <div key={key} className={style.itemResumen}>
                  <span className={style.name}>{nombre}:</span>
                  <p>{cantidad} {tipo}</p>
                </div>
              );
            })}
            <div className={style.itemResumen}>
              <span><strong>Total vendido:</strong></span>
              <span className={style.total}>${formatNumber(totalDelDia)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuscarPedidos;
