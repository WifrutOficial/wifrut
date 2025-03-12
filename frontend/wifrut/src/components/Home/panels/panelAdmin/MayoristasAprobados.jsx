import React, { useState, useEffect } from "react";
import style from "../../../../styles/MayoristasAprobados.module.css"

function MayoristasAprobados() {
  const [mayoristas, setMayoristas] = useState([]);

  useEffect(() => {
    // Recuperar de localStorage cuando el componente se monte
    const aprobadosGuardados = JSON.parse(localStorage.getItem("mayoristasAprobados")) || [];
    setMayoristas(aprobadosGuardados);
  }, []);

  return (
    <div className={style.container}>
      <h2>Lista de Clientes Mayoristas</h2>
      {mayoristas.length === 0 ? (
        <p>No hay mayoristas aprobados</p>
      ) : (
        <ul className={style.solicitudesList}>
          {mayoristas.map((mayorista) => (
            <li key={mayorista._id} className={style.solicitudItem}>
              <div className={style.solicitudInfo}>
                <p><strong>Nombre:</strong> {mayorista.nombre}</p>
                <p><strong>CUIL:</strong> {mayorista.cuil}</p>
                <p><strong>Email:</strong> {mayorista.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MayoristasAprobados;
