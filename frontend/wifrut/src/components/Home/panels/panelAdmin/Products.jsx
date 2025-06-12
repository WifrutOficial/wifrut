import { useState } from "react";
import axios from "axios";
import style from "../../../../styles/ProductCarga.module.css";

function Products() {
  const [retailFile, setRetailFile] = useState(null);
  //const [wholesaleFile, setWholesaleFile] = useState(null);

  const handleFileChange = (e, type) => {
    if (type === "retail") {
      setRetailFile(e.target.files[0]);
      console.log("Archivo de retail seleccionado:", e.target.files[0]);
    } else {
      setWholesaleFile(e.target.files[0]);
      console.log("Archivo de mayorista seleccionado:", e.target.files[0]);
    }
  };

  const handleUpload = async (file, type) => {
    if (!file) {
      alert("Selecciona un archivo");
      return;
    }

    console.log("Archivo a subir:", file); 
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
       `${import.meta.env.VITE_API_URL}/api/products/${type}/upload`, 
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          timeout: 30000,
        }
      );
      console.log("Respuesta del servidor:", response); 
      alert(response.data.message);
    } catch (error) {
      console.error("Error al subir el archivo", error);
      if (error.response) {
        alert(`Error del servidor: ${error.response.data.message}`);
      } else if (error.request) {
        alert("No se pudo conectar al servidor. Verifica la conexión");
      } else {
        alert("Error al procesar la solicitud");
      }
    }
  };

  return (
    <div className={style.container1}>
   
      <div className={style.containerGlass}>
        <p className={style.title}>Carga de Productos Minoristas</p>
        <div className={style.container}>
          
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            id="file-upload-retail"
            onChange={(e) => handleFileChange(e, "retail")}
            className={style.hiddenInput}
          />
          <div className={style.containerInfo}>
            <label htmlFor="file-upload-retail" className={style.customFileButton}>
              {retailFile ? retailFile.name : "Cargar Excel de Productos"}
            </label>
            <button className={style.btn} onClick={() => handleUpload(retailFile, "retail")}>
              Cargar Excel
            </button>
          </div>
        </div>
      </div>

     
      <div className={style.containerGlass}>
       {/*  <div className={style.container}>
          <p className={style.title}>Carga de Productos Mayoristas</p>
          <input
            type="file"
            accept=".xlsx, .xls"
            id="file-upload-wholesale"
            onChange={(e) => handleFileChange(e, "wholesale")}
            className={style.hiddenInput}
          />
          <div className={style.containerInfo}>
            <label htmlFor="file-upload-wholesale" className={style.customFileButton}>
              {wholesaleFile ? wholesaleFile.name : "Cargar Excel de Productos"}
            </label>
            <button className={style.btn} onClick={() => handleUpload(wholesaleFile, "wholesale")}>
              Cargar Excel
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Products;
