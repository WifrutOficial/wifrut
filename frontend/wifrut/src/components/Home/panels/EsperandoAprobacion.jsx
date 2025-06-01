import React, { useState, useEffect } from "react";
import style from "../../../styles/EsperandoAprobacion.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EsperandoAprobacion() {
  const navigate = useNavigate();

  const [mayoristaData, setMayoristaData] = useState({
    cuil: "",
    provincia: "",
    localidad: "",
    aniosActividad: "",
  });
  

  const handleChange = (e) => {
    setMayoristaData({
      ...mayoristaData,
      [e.target.name]: e.target.value,
    });
  };

   
   useEffect(() => {
    const verificarDatos = async () => {
      try {
        const response = await axios.get(
           `${import.meta.env.VITE_API_URL}/api/mayorista/obtener-datos-mayorista `,
          { withCredentials: true }
        );
  
        console.log("🔍 Respuesta del backend:", response.data);
  
        if (response.data.data) {
         
          const usuarioActual = response.data.data.userId;
          const usuarioAutenticado = authStatus.user.id;
  
          console.log("✅ ID en base de datos:", usuarioActual);
          console.log("✅ ID usuario autenticado:", usuarioAutenticado);
  
          if (usuarioActual === usuarioAutenticado) {
            navigate("/paginadeespera");
          }
        }
      } catch (error) {
        console.error("⚠️ Error al verificar datos:", error);
      }
    };
  
    verificarDatos();
  }, [navigate]);
  
  

  const formHandle = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", mayoristaData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mayorista/guardar-datos-mayorista`,
        mayoristaData,
        { withCredentials: true }
      );
      alert("Formulario enviado correctamente.");
      navigate("/paginadeespera");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Hubo un error al enviar los datos.");
      }
    }
  };

  return (
    <div className={style.container}>
      <div className={style.containerForm}> 
        <img className={style.logo} src="../../../../logo.png" alt="logo" />
        <p className={style.title}>Para conertirte el mayorista cargá los siguientes datos</p>
        <form className={style.formContainer} onSubmit={formHandle}>
          <input
            type="number"
            name="cuil"
            placeholder="CUIL/CUIT"
            value={mayoristaData.cuil}
            onChange={handleChange}
          />

          <select
            name="provincia"
            value={mayoristaData.provincia}
            onChange={handleChange}
          >
            <option value="">Seleccione provincia</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Mendoza">Mendoza</option>
            <option value="Tucumán">Tucumán</option>
            <option value="Otra">Otra</option>
          </select>

          <input
            type="text"
            name="localidad"
            placeholder="Localidad"
            value={mayoristaData.localidad}
            onChange={handleChange}
          />

          <input
            type="number"
            name="aniosActividad"
            placeholder="Años de actividad"
            value={mayoristaData.aniosActividad}
            onChange={handleChange}
          />

          <button type="submit">Enviar datos</button>
        </form>
      </div>
    </div>
  );
}

export default EsperandoAprobacion;
