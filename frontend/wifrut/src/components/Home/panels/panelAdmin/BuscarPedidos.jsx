import React, { useState } from "react";
import style from "../../../../styles/BuscarPedidos.module.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

function BuscarPedidos() {
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // 👈 nuevo estado para zoom

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
            const { total, direccion, metodoPago, status, createdAt } = order;
            const phone = order?.userId?.phone || "No disponible";
            const isSelected = selectedOrder?._id === order._id;
            const orderClasses = `${style.contaonerItems} ${
              isSelected ? style.zoomed : ""
            }`;

            return (
              <div
                className={orderClasses}
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

                {/* contenido */}
                <div className={style.pedidos}>
                  <p className={style.p}>
                    <span className={style.span}>Total del pedido:</span>
                    <p className={style.resultados}>{total}</p>
                  </p>
                  <p className={style.p}>
                    <span className={style.span}>Dirección de envío:</span>{" "}
                    {direccion}
                  </p>
                  <p className={style.p}>
                    <span className={style.span}>Método de pago:</span>{" "}
                    {metodoPago}
                  </p>
                </div>
                <div className={style.pedidos2}>
                  <p className={style.p}>
                    <span className={style.span}>Estado del pago:</span>{" "}
                    {status}
                  </p>
                  <p className={style.p}>
                    <span className={style.span}>Fecha del pedido:</span>{" "}
                    {new Date(createdAt).toLocaleDateString()}
                  </p>
                  <p className={style.p}>
                    <span className={style.span}>Teléfono:</span> {phone}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay pedidos para esta fecha</p>
        )}
      </div>

      {/* Fondo oscuro para cerrar zoom */}
      {selectedOrder && (
        <div className={style.overlay} onClick={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

export default BuscarPedidos;
