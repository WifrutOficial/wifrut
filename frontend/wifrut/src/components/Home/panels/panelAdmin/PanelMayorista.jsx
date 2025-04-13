import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../../../../styles/PanelMayorista.module.css";

function PanelMayorista() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mayoristasAprobados, setMayoristasAprobados] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await axios.get(
         `${import.meta.env.VITE_API_URL}/api/admin/obtener-datos-mayorista`,
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
        `${import.meta.env.VITE_API_URL}/api/admin/aprobar-mayorista/${id}`,
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
          {solicitudes.map((solicitud) => {
            const isSelected = selectedOrder?._id === solicitud._id;
            const itemClasses = `${style.solicitudItem} ${isSelected ? style.zoomed : ""}`;
        
            return (
              <li
                key={solicitud._id}
                className={itemClasses}
                onClick={() => !selectedOrder && setSelectedOrder(solicitud)}
              >
                {isSelected && (
                  <img
                    src="/close-icon.svg"
                    alt="Cerrar"
                    className={style.closeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(null);
                    }}
                  />
                )}
                <div className={style.solicitudInfo}>
                  <p><strong>Nombre:</strong> {solicitud.userId.nombre}</p>
                  <p><strong>CUIL:</strong> {solicitud.cuil || "No especificado"}</p>
                  <p><strong>Email:</strong> {solicitud.userId.email}</p>
                  <p><strong>Años de Actividad:</strong> {solicitud.aniosActividad}</p>
                </div>
                <div className={style.solicitudInfo}>
                  <p><strong>Teléfono:</strong> {solicitud.userId.phone}</p>
                  <p><strong>Provincia:</strong> {solicitud.provincia}</p>
                  <p><strong>Localidad:</strong> {solicitud.localidad}</p>
                </div>
                {!isSelected && (
                  <div className={style.solicitudActions}>
                    <button
                      className={style.aprobarBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAprobar(solicitud.userId._id);
                      }}
                    >
                      Aceptar
                    </button>
                    <button
                      className={style.rechazarBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRechazar(solicitud._id);
                      }}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        
        )}
      </div>
        {/* Fondo oscuro para cerrar zoom */}
            {selectedOrder && (
              <div className={style.overlay} onClick={() => setSelectedOrder(null)} />
            )}
    </div>
  );
}

export default PanelMayorista;
