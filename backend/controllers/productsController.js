import XLSX from "xlsx";
import { Product } from "../models/products.js";
import { WholesaleProduct } from "../models/productsMayorista.js";



//MINORISTA
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    // Leer el archivo Excel desde el buffer de Multer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir los datos del Excel a un array de objetos
    const productsFromExcel = XLSX.utils.sheet_to_json(sheet);

    // Verificar qué datos se están leyendo del Excel
    console.log("Productos procesados:", productsFromExcel);

    // Obtener los productos actuales en la base de datos
    const existingProducts = await Product.find({});

    // 1. Actualizar o insertar productos nuevos
    const bulkOps = productsFromExcel.map((product) => {
      const updateFields = { ...product };

      // Convertir precio y descuento a números para asegurarse de que no sean strings
      const precio = Number(product.precio);
      const descuento = Number(product.descuento);

      console.log(`Procesando producto: ${product.nombre}`);
      console.log(`Precio: ${precio}, Descuento: ${descuento}`);

      // Si no hay descripción en el archivo, dejarlo como null
      updateFields.descripcion =
        product.descripcion && product.descripcion.trim() !== ""
          ? product.descripcion
          : null;

      // Si el producto tiene un descuento mayor que 0, calcular el precio con descuento
      if (!isNaN(precio) && !isNaN(descuento) && descuento > 0) {
        updateFields.precioConDescuento = precio - (precio * descuento) / 100;
        console.log(`Precio con descuento calculado: ${updateFields.precioConDescuento}`);
      } else {
        updateFields.precioConDescuento = precio; // Usar el precio original si no hay descuento
        console.log(`No se aplica descuento, precioConDescuento: ${updateFields.precioConDescuento}`);
      }

      return {
        updateOne: {
          filter: { nombre: product.nombre },
          update: { $set: updateFields },
          upsert: true, // Si no existe, crea uno nuevo
        },
      };
    });

    // Ejecutar operaciones en la base de datos para actualizar o insertar productos
    await Product.bulkWrite(bulkOps);

    // 2. Eliminar productos que ya no están en el Excel
    const productsToDelete = existingProducts.filter(
      (product) =>
        !productsFromExcel.some(
          (excelProduct) => excelProduct.nombre === product.nombre
        )
    );

    if (productsToDelete.length > 0) {
      const deleteOps = productsToDelete.map((product) => ({
        deleteOne: { filter: { _id: product._id } },
      }));

      // Eliminar los productos que no están en el Excel
      await Product.bulkWrite(deleteOps);
    }

    // En lugar de updatedProducts, deberías usar productsFromExcel si los productos con los precios calculados se encuentran en esa variable
    res.status(200).json({
      message: "Productos actualizados y eliminados exitosamente",
      products: productsFromExcel, // Esto enviará los productos con el precio calculado
    });

  } catch (error) {
    console.error("Error al procesar el archivo:", error);
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

//MAYORISTA

export const uploadWholesaleExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    // Leer el archivo Excel desde el buffer de Multer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const productsFromExcel = XLSX.utils.sheet_to_json(sheet);

    // Verificar qué datos se están leyendo del Excel
    console.log("Productos mayoristas procesados:", productsFromExcel);

    // Obtener los productos actuales en la base de datos
    const existingProducts = await WholesaleProduct.find({});

    // Actualizar o insertar productos nuevos
    const bulkOps = productsFromExcel.map((product) => {
      const updateFields = { ...product };

      // Convertir precio y descuento a números para asegurarse de que no sean strings
      const precio = Number(product.precio);
      const descuento = Number(product.descuento);

      console.log(`Procesando producto mayorista: ${product.nombre}`);
      console.log(`Precio: ${precio}, Descuento: ${descuento}`);

      // Si no hay descripción en el archivo, dejarlo como null
      updateFields.descripcion =
        product.descripcion && product.descripcion.trim() !== ""
          ? product.descripcion
          : null;

      // Si el producto tiene un descuento mayor que 0, calcular el precio con descuento
      if (!isNaN(precio) && !isNaN(descuento) && descuento > 0) {
        updateFields.precioConDescuento = precio - (precio * descuento) / 100;
        console.log(`Precio con descuento calculado: ${updateFields.precioConDescuento}`);
      } else {
        updateFields.precioConDescuento = precio; // Usar el precio original si no hay descuento
        console.log(`No se aplica descuento, precioConDescuento: ${updateFields.precioConDescuento}`);
      }

      return {
        updateOne: {
          filter: { nombre: product.nombre, descripcion: product.descripcion },
          update: { $set: updateFields },
          upsert: true, // Si no existe, crea uno nuevo
        },
      };
    });

    // Ejecutar operaciones en la base de datos para actualizar o insertar productos
    await WholesaleProduct.bulkWrite(bulkOps);

    // Eliminar productos que ya no están en el Excel
    const productsToDelete = existingProducts.filter(
      (product) =>
        !productsFromExcel.some(
          (excelProduct) => excelProduct.nombre === product.nombre
        )
    );

    if (productsToDelete.length > 0) {
      const deleteOps = productsToDelete.map((product) => ({
        deleteOne: { filter: { _id: product._id } },
      }));

      // Eliminar los productos que no están en el Excel
      await WholesaleProduct.bulkWrite(deleteOps);
    }

    res.status(200).json({
      message: "Productos mayoristas actualizados y eliminados exitosamente",
    });

  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ message: "Error al procesar el archivo" });
  }
};

export const getWholesaleProducts = async (req, res) => {
  try {
    const products = await WholesaleProduct.find().lean();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos mayoristas:", error);
    res.status(500).json({ message: "Error al obtener productos mayoristas" });
  }
};
