import XLSX from "xlsx";
import { Product } from "../models/products.js";

export const uploadExcel = async (req, res) =>{
  try {
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ningún archivo" });
      }
  
      // Leer el archivo Excel desde el buffer de Multer
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  
      // Obtener la primera hoja del archivo
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      // Convertir los datos del Excel a un array de objetos
      const products = XLSX.utils.sheet_to_json(sheet);
  
      // Guardar los productos en la base de datos
      const savedProducts = await Product.insertMany(products);
  
      res.status(200).json({
        message: "Productos cargados exitosamente",
        data: savedProducts,
      });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ message: "Error al procesar el archivo" });
  }
  }