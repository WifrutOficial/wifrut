import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../../../../styles/PanelMayorista.module.css";

function PanelMayorista() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mayoristasAprobados, setMayoristasAprobados] = useState([]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/obtener-datos-mayorista",
          { withCredentials: true }
        );
        
        // Filtrar las solicitudes para mostrar solo las que están pendientes
        const solicitudesPendientes = response.data.filter(
          (solicitud) => solicitud.userId.estadoCuenta === "pendiente"
        );
        
        setSolicitudes(solicitudesPendientes);
      } catch (error) {
        console.error("Error al obtener solicitudes", error);
      }
    };
    fetchSolicitudes();
  }, [mayoristasAprobados]);

  const handleAprobar = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/aprobar-mayorista/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Filtrar el mayorista aprobado de las solicitudes
        const solicitudAprobada = solicitudes.find(
          (solicitud) => solicitud.userId._id === id
        );

        // Si la solicitud es válida, actualizar el estado de las solicitudes y mayoristas aprobados
        if (solicitudAprobada) {
          // Eliminar el mayorista aprobado de las solicitudes
          setSolicitudes((prevSolicitudes) =>
            prevSolicitudes.filter(
              (solicitud) => solicitud.userId._id !== id
            )
          );

          // Agregar el mayorista aprobado a la lista de mayoristas aprobados
          setMayoristasAprobados((prevMayoristasAprobados) => [
            ...prevMayoristasAprobados,
            solicitudAprobada,
          ]);
        }

        console.log("Mayorista aprobado correctamente:", response.data);
      } else {
        console.error("Error: No se pudo aprobar al mayorista");
      }
    } catch (error) {
      console.error("Error al aprobar mayorista:", error);
    }
  };

  const handleRechazar = (id) => {
    setSolicitudes(solicitudes.filter((s) => s._id !== id));
  };

  return (
    <div className={style.container}>
      <div className={style.navContent}>
        <h2>Solicitudes de Mayoristas</h2>
        {solicitudes.length === 0 ? (
          <p style={{ color: "#fff" }}>No hay solicitudes pendientes</p>
        ) : (
          <ul className={style.solicitudesList}>
            {solicitudes.map((solicitud) => (
              <li key={solicitud._id} className={style.solicitudItem}>
                <div className={style.solicitudInfo}>
                  <p>
                    <strong>Nombre:</strong> {solicitud.userId.nombre}
                  </p>
                  <p>
                    <strong>CUIL:</strong> {solicitud.cuil || "No especificado"}
                  </p>
                  <p>
                    <strong>Email:</strong> {solicitud.userId.email}
                  </p>
                  <p>
                    <strong>Años de Actividad:</strong> {solicitud.aniosActividad}
                  </p>
                </div>
                <div className={style.solicitudInfo}>
                  <p>
                    <strong>Telefono:</strong> {solicitud.userId.phone}
                  </p>
                  <p>
                    <strong>Provincia:</strong> {solicitud.provincia}
                  </p>
                  <p>
                    <strong>Localidad:</strong> {solicitud.localidad}
                  </p>
                </div>
                <div className={style.solicitudActions}>
                  <button
                    className={style.aprobarBtn}
                    onClick={() => handleAprobar(solicitud.userId._id)}
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
