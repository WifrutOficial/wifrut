import axios from "axios";
import { useState, useEffect } from "react";
import style from "../../../../styles/MayoristasAprobados2.module.css";


function MayoristasAprobados2() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/register/mayoristas`,
          { withCredentials: true }
        );

        // 1. Ver qué llega del backend:
        console.log("👉 mayoristas desde backend:", res.data);

        // 2. Filtrar solo los pendientes:
        const solicitudesPendientes = res.data.filter(
          (u) => u.estadoCuenta === "pendiente"
        );

        // 3. Guardar en el estado:
        setSolicitudes(solicitudesPendientes);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };

    fetchSolicitudes();
  }, []); // <-- array de dependencias vacío para que solo se ejecute una vez

  return (
    <div>
      <h2>Lista de Clientes Mayorista</h2>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul>
          {solicitudes.map((u) => (
            <div className={style.containerInfo} key={u._id}>
              <p> Nombre:{u.nombre} </p>
              <p>Email:{u.email} </p>
              <p> Telefono:{u.phone} </p>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MayoristasAprobados2;
