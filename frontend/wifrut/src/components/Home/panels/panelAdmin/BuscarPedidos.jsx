import React, { useState } from "react";
import style from "../../../../styles/BuscarPedidos.module.css";
import axios from "axios";

function BuscarPedidos() {
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrdersByDate = async () => {
    if (!date) return alert("Selecciona una fecha");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/whatsapp/ordersByDate?date=${date}`
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
          orders.map((order , userId) => {
            const { total, direccion, metodoPago, status, createdAt } = order;
            console.log("userId en frontend:", userId); // Verifica si `userId` tiene `phone`
  
            const phone = userId?.phone || "No disponible"; // Asegura que no sea undefined
            return (
              <div className={style.contaonerItems} key={order._id}>
                <div className={style.pedidos}>
                  <p>
                    {" "}
                    <span className={style.span}>Total del pedido:</span>{" "}
                    {total}
                  </p>
                  <p>
                    <span className={style.span}>Dirección de envío:</span>{" "}
                    {direccion}
                  </p>
                  <p>
                    <span className={style.span}>Método de pago:</span>{" "}
                    {metodoPago}
                  </p>
                </div>
                <div className={style.pedidos2}>
                  <p>
                    <span className={style.span}>Estado del pago:</span>{" "}
                    {status}
                  </p>
                  <p>
                    <span className={style.span}> Fecha del pedido:</span>{" "}
                    {new Date(createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className={style.span}>Telefono:</span>{" "}
                    {phone}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay pedidos para esta fecha</p>
        )}
      </div>
    </div>
  );
}

export default BuscarPedidos;
