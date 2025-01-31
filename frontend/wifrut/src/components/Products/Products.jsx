import React from "react";
import style from "../../styles/Products.module.css";
import { useState } from "react";
import axios from "axios";

function Products() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/products/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error al subir el archivo", error);
      alert("Error al subir el archivo");
    }
  };

  return (
    <div className={style.container}>
      <p className={style.title}>Seccion de carga de productos</p>
      <input
        type="file"
        accept=".xlsx, .xls"
        id="file-upload"
        onChange={handleFileChange}
        className={style.hiddenInput}
      />
      <div className={style.containerInfo}>
        <label htmlFor="file-upload" className={style.customFileButton}>
          {file ? file.name : "Cargar Excel de Productos"}
        </label>

        <button className={style.btn} onClick={handleUpload}>
          Subir
        </button>
      </div>
    </div>
  );
}

export default Products;
