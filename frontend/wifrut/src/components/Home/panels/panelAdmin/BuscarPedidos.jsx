import React, { useState } from "react";
import style from "../../../../styles/BuscarPedidos.module.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

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
      <h2>Buscar pedidos por fecha</h2>

      <div className={style.search}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchOrdersByDate}>Buscar</button>
      </div>

      <h3>Resultados</h3>

      <div className={style.containerInfo}>
        {orders.length > 0 ? (
          orders.map((order) => {
            const { total, direccion, metodoPago, status, createdAt, items } = order;
            const phone = order?.userId?.phone || "No disponible";
            const isSelected = selectedOrder?._id === order._id;

            return (
              <div
                className={style.contaonerItems}
                key={order._id}
                onClick={() => !selectedOrder && setSelectedOrder(order)}
              >
                {isSelected && (
                  <IoMdClose
                    className={style.closeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(null);
                    }}
                  />
                )}

                {/* Información del pedido */}
                <div className={style.infoPedido}>
                  <div>
                    <p><span>Total del pedido:</span> ${total.toFixed(2)}</p>
                    <p><span>Dirección de envío:</span> {direccion}</p>
                    <p><span>Método de pago:</span> {metodoPago}</p>
                  </div>
                  <div>
                    <p><span>Estado del pago:</span> {status}</p>
                    <p><span>Fecha del pedido:</span> {new Date(createdAt).toLocaleDateString()}</p>
                    <p><span>Teléfono:</span> {phone}</p>
                  </div>
                </div>

                {/* Detalles de productos por pedido */}
                <div className={style.productosPedido}>
                  <p><strong>Productos del pedido:</strong></p>
                  <ul>
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
          <p>No hay pedidos para esta fecha</p>
        )}
      </div>

      {/* Resumen del día */}
      {orders.length > 0 && (
        <div className={style.resumen}>
          <h3>Total de Productos:</h3>
          {Object.entries(resumenProductos).map(([key, cantidad]) => {
            const [nombre, tipo] = key.split("__");
            return (
              <div key={key} className={style.itemResumen}>
                <span>{nombre}</span>
                <span>{cantidad} {tipo}</span>
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
