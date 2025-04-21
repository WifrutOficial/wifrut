import React, { useState } from "react";
import style from "../../../../styles/BuscarPedidos.module.css";
import axios from "axios";


function BuscarPedidos() {
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrdersByDate = async () => {
    if (!date) return alert("Selecciona una fecha");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/whatsapp/ordersByDate?date=${date}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      alert("Error al obtener pedidos");
    }
  };

  // Resumen de productos y total del día
  const resumenProductos = {};
  let totalDelDia = 0;

  orders.forEach((order) => {
    totalDelDia += order.total;

    order.items.forEach((item) => {
      const nombre = item.productId?.nombre || "desconocido";
      const tipo = item.productId?.tipoVenta || "unidades";
      const key = `${nombre}__${tipo}`;

      resumenProductos[key] = (resumenProductos[key] || 0) + item.cantidad;
    });
  });

  return (
    <div className={style.container}>
      <h2 className={style.title}>Buscar pedidos por fecha</h2>

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
        {orders.length > 0 ? (
          orders.map((order) => {
            const { total, direccion, metodoPago, status, createdAt, items } = order;
            const phone = order?.userId?.phone || "No disponible";
            const isSelected = selectedOrder?._id === order._id;

            return (
              <div
                className={style.containerItems}
                key={order._id}
                onClick={() => !selectedOrder && setSelectedOrder(order)}
              >
             

                {/* Información del pedido */}
                <div className={style.infoPedido}>
                  <div className={style.info1}>
                    <p><span>Total:</span> ${total.toFixed(2)}</p>
                    <p><span>Dirección:</span> {direccion}</p>
                    <p><span>Pago:</span> {metodoPago}</p>
                  </div>
                  <div className={style.info1}>
                    <p><span>Estado:</span> {status}</p>
                    <p><span>Fecha:</span> {new Date(createdAt).toLocaleDateString()}</p>
                    <p><span>Teléfono:</span> {phone}</p>
                  </div>
                </div>

                {/* Detalles de productos por pedido */}
                <div className={style.productosPedido}>
                  <p className={style.title}>Productos del pedido:</p>
                  <ul className={style.infoProducto} >
                    {items.map((item, index) => (
                      <li key={index}>
                        {item.productId?.nombre || "desconocido"}: {item.cantidad} {item.productId?.tipo || "unidades"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        ) : (
          <p className={style.none}>No hay pedidos para esta fecha</p>
        )}
      </div>

      {/* Resumen del día */}
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
            <span className={style.total}>${totalDelDia.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuscarPedidos;
