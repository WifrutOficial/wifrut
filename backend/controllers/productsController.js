import XLSX from "xlsx";
import { Product } from "../models/products.js";

export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }

    // Leer el archivo Excel desde el buffer de Multer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir los datos del Excel a un array de objetos
    const products = XLSX.utils.sheet_to_json(sheet);

    // Verificar qué datos se están leyendo del Excel
    console.log("Productos procesados:", products);

    // Generar operaciones para actualización o inserción
    const bulkOps = products.map((product) => {
      // Si tipoVenta no existe en el Excel, no lo sobrescribimos
      const updateFields = { ...product };
      if (!product.tipoVenta) {
        delete updateFields.tipoVenta;
      }

      return {
        updateOne: {
          filter: { nombre: product.nombre, descripcion: product.descripcion }, // Buscar por nombre + descripción
          update: { $set: updateFields }, // Actualizar si existe
          upsert: true, // Insertar si no existe
        },
      };
    });

    // Ejecutar operaciones en la base de datos
    await Product.bulkWrite(bulkOps);

    res.status(200).json({ message: "Productos actualizados exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el archivo" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};
