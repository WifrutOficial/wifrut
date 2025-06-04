import XLSX from "xlsx";
import { Product } from "../models/products.js";


export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const productsFromExcel = XLSX.utils.sheet_to_json(sheet, { raw: true });

    const cleanProducts = productsFromExcel.map((product) => {
      const cleanedProduct = {};

      for (const key in product) {
        if (
          key &&
          !key.startsWith("__") &&
          product[key] !== null &&
          product[key] !== ""
        ) {
          cleanedProduct[key.trim()] =
            typeof product[key] === "string"
              ? product[key].trim()
              : product[key];
        }
      }

      return cleanedProduct;
    });

    const existingProducts = await Product.find({});

    const bulkOps = cleanProducts.map((product) => {
      const updateFields = { ...product };

      const precio = Number(product.precio);
      const descuento = Number(product.descuento);

      updateFields.descripcion =
        product.descripcion && product.descripcion.trim() !== ""
          ? product.descripcion
          : null;

      // ✅ Precio con o sin descuento
      if (!isNaN(precio) && !isNaN(descuento) && descuento > 0) {
        updateFields.precioConDescuento = precio - (precio * descuento) / 100;
        console.log(
          `Precio con descuento calculado: ${updateFields.precioConDescuento}`
        );
      } else {
        updateFields.precioConDescuento = precio;
        console.log(
          `No se aplica descuento, precioConDescuento: ${updateFields.precioConDescuento}`
        );
      }

      // ✅ Nuevo: Conversión y validación de kiloMinimo
      if (product.kiloMinimo !== undefined) {
        const kiloMin = Number(product.kiloMinimo);
        if ([0.5, 1].includes(kiloMin)) {
          updateFields.kiloMinimo = kiloMin;
        } else {
          console.warn(
            `Valor de kiloMinimo no válido para ${product.nombre}: ${product.kiloMinimo}`
          );
        }
      }

      return {
        updateOne: {
          filter: { nombre: product.nombre },
          update: { $set: updateFields },
          upsert: true,
        },
      };
    });

    await Product.bulkWrite(bulkOps);

    const productsToDelete = existingProducts.filter(
      (product) =>
        !cleanProducts.some(
          (excelProduct) => excelProduct.nombre === product.nombre
        )
    );

    if (productsToDelete.length > 0) {
      const deleteOps = productsToDelete.map((product) => ({
        deleteOne: { filter: { _id: product._id } },
      }));

      await Product.bulkWrite(deleteOps);
    }

    res.status(200).json({
      message: "Productos actualizados y eliminados exitosamente",
      products: cleanProducts,
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
