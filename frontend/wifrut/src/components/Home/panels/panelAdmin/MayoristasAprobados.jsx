import React, { useState, useEffect } from "react";
import style from "../../../../styles/MayoristasAprobados.module.css";
import axios from "axios";

function MayoristasAprobados() {
  const [mayoristasAprobados, setMayoristasAprobados] = useState([]);
  useEffect(() => {
    const fetchMayoristasAprobados = async () => {
      try {
        const response = await axios.get(
            `${API_URL}/api/admin/mayoristas-aprobados`,
          { withCredentials: true }
        );
        setMayoristasAprobados(response.data);
      } catch (error) {
        console.error("Error al obtener mayoristas aprobados", error);
      }
    };
    fetchMayoristasAprobados();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.navContent}>
        <h2>Mayoristas Aprobados</h2>
        {mayoristasAprobados.length === 0 ? (
          <p style={{ color: "#fff" }}>No hay mayoristas aprobados</p>
        ) : (
          <ul className={style.solicitudesList}>
            {mayoristasAprobados.map((mayorista) => (
              <li key={mayorista._id} className={style.solicitudItem}>
                <div className={style.solicitudInfo1}>
                  <p>
                    <strong>Nombre:</strong> {mayorista.userId.nombre}
                  </p>
                  <p>
                    <strong>CUIL:</strong> {mayorista.cuil || "No especificado"}
                  </p>
                  <p>
                    <strong>Email:</strong> {mayorista.userId.email}
                  </p>
                  <p>
                    <strong>Años de Actividad:</strong>{" "}
                    {mayorista.aniosActividad}
                  </p>
                </div>
                <div className={style.solicitudInfo}>
                  <p>
                    <strong>Telefono:</strong> {mayorista.userId.phone}
                  </p>
                  <p>
                    <strong>Provincia:</strong> {mayorista.provincia}
                  </p>
                  <p>
                    <strong>Localidad:</strong> {mayorista.localidad}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MayoristasAprobados;
