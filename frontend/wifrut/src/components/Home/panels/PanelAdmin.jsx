import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../../../styles/Admin.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

function PanelAdmin() {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);

  //cargar las solicitudes
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/solicitudes-mayoristas",
          { withCredentials: true }
        );
        setSolicitudes(response.data);
      } catch (error) {
        console.error("Error al obtener solicitudes", error);
      }
    };
    fetchSolicitudes();
  }, []);

  return (
    <div className={style.container}>
      <p>este es el panel del administrador</p>
      <button onClick={() => navigate("/productos")}>
        navegar a productos
      </button>
      <div>
        <h2>Solicitudes de Mayoristas</h2>
        {solicitudes.length === 0 ? (
          <p>no hay solicitudes pendientes</p>
        ) : (
          <ul>
            {solicitudes.map((solicitud) => (
              <li key={solicitud._id}>
                {solicitud.nombre} - {solicitud.email} -{" "}
                {solicitud.estadoCuenta}
                {/* Aquí irán los botones para aprobar o rechazar */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PanelAdmin;
