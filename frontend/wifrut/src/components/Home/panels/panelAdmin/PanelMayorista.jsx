import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../../../../styles/PanelMayorista.module.css";

function PanelMayorista() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mayoristasAprobados, setMayoristasAprobados] = useState(
    JSON.parse(localStorage.getItem("mayoristasAprobados")) || []
  );

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

  const handleAprobar = (id) => {
    const solicitudAprobada = solicitudes.find((s) => s._id === id);
    const nuevosAprobados = [...mayoristasAprobados, solicitudAprobada];
    setMayoristasAprobados(nuevosAprobados);
    setSolicitudes(solicitudes.filter((s) => s._id !== id));

    //Guardar en localStorage para persistencia
    localStorage.setItem(
      "mayoristasAprobados",
      JSON.stringify(nuevosAprobados)
    );
  };

  const handleRechazar = (id) => {
    setSolicitudes(solicitudes.filter((s) => s._id !== id));
  };

  return (
    <div className={style.container}>
      <div className={style.navContent}>
        <h2>Solicitudes de Mayoristas</h2>
        {solicitudes.length === 0 ? (
          <p>No hay solicitudes pendientes</p>
        ) : (
          <ul className={style.solicitudesList}>
            {solicitudes.map((solicitud) => (
              <li key={solicitud._id} className={style.solicitudItem}>
                <div className={style.solicitudInfo}>
                  <p>
                    <strong>Nombre:</strong> {solicitud.nombre}
                  </p>
                  <p>
                    <strong>CUIL:</strong> {solicitud.cuil || "No especificado"}
                  </p>
                  <p>
                    <strong>Email:</strong> {solicitud.email}
                  </p>
                </div>
                <div className={style.solicitudActions}>
                  <button
                    className={style.aprobarBtn}
                    onClick={() => handleAprobar(solicitud._id)}
                  >
                    Aceptar
                  </button>
                  <button
                    className={style.rechazarBtn}
                    onClick={() => handleRechazar(solicitud._id)}
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PanelMayorista;
