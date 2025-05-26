import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import style from "../../styles/RepetirPedido.module.css";

function RepetirPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const { setCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/order/repetir-pedido`,
          {
            withCredentials: true,
          }
        );
        if (Array.isArray(res.data)) setPedidos(res.data);
      } catch (error) {
        console.error("Error al traer pedidos:", error);
      }
    };
    fetchPedidos();
  }, []);

  const handleRepetir = (pedido) => {
    const itemsConNumeros = pedido.items.map((item) => ({
      ...item,
      precio: Number(item.precio),
      quantity: Number(item.cantidad ?? item.quantity ?? 1),
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

  if (!pedidos.length) return <p>No hay pedidos anteriores para mostrar.</p>;

  return (
    <div>
      <h2>Pedidos anteriores</h2>
      {pedidos.map((pedido, index) => (
        <div
          key={index}
          className={style.containerPedido}
          style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}
        >
          <h4>Pedido #{index + 1}</h4>
          <div>
            {pedido.items.map((item, i) => {
              const qty = item.cantidad ?? item.quantity ?? 1;
              return (
                <div className={style.containerProducts} key={i}>
                  <p> Producto: {item.nombre} </p>
                  <p> Precio Unidad: ${item.precio} </p>
                  <p> Cantidad: {qty} </p> {/* ← Aquí usá qty */}
                  <p>
                    {" "}
                    Precio Total: $
                    {(Number(item.precio) * Number(qty)).toFixed(2)}{" "}
                  </p>
                </div>
              );
            })}
          </div>
          <button className={style.btn} onClick={() => handleRepetir(pedido)}>
            Repetir este pedido
          </button>
        </div>
      ))}
    </div>
  );
}

export default RepetirPedidos;
