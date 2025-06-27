import XLSX from "xlsx";
import { Product } from "../models/products.js";

// Cargar productos desde un archivo Excel (.xlsx)
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
      codepage: 65001, // asegúrate de que el archivo se lea en UTF-8
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      return res.status(400).json({ message: `La hoja '${sheetName}' no se pudo encontrar o está vacía.` });
    }

    const productsFromExcel = XLSX.utils.sheet_to_json(sheet, { raw: true });

    const cleanProducts = productsFromExcel
      .map((product) => {
        const cleanedProduct = {};
        for (const key in product) {
          if (key && !key.startsWith("__") && product[key] !== null && product[key] !== "") {
            const cleanedKey = key.trim().toLowerCase();
            const cleanedValue = typeof product[key] === "string" ? product[key].trim() : product[key];
            cleanedProduct[cleanedKey] = cleanedValue;
          }
        }
        return cleanedProduct;
      })
      .filter((p) => p.nombre);

    const bulkOps = cleanProducts.map((product) => {
      const updateFields = { ...product };

      // Tipo de venta
      if (product.tipoventa) {
        const tipoVenta = String(product.tipoventa).toLowerCase().trim();
        if (tipoVenta.includes("kilo")) updateFields.tipoVenta = "kilo";
        else if (tipoVenta.includes("unidad")) updateFields.tipoVenta = "unidad";
        else if (tipoVenta.includes("litro")) updateFields.tipoVenta = "litro";
        else updateFields.tipoVenta = "unidad"; // default
      } else {
        updateFields.tipoVenta = "unidad";
      }

      // Precio y descuento
      let precio = Number(product.precio);
      if (isNaN(precio)) {
        console.warn(`Precio inválido ('${product.precio}') para '${product.nombre}', se usará 0`);
        precio = 0;
      }

      const descuento = Number(product.descuento);
      updateFields.descripcion = product.descripcion || null;

      updateFields.precioConDescuento =
        !isNaN(descuento) && descuento > 0 ? precio - (precio * descuento) / 100 : precio;

      // Kilo mínimo (validado)
      if (product.kilominimo !== undefined) {
        const kiloMin = Number(product.kilominimo);
        if ([0.5, 0.25, 0.2, 1, 2, 3].includes(kiloMin)) {
          updateFields.kiloMinimo = kiloMin;
        } else {
          console.warn(`kiloMinimo no válido para ${product.nombre}: ${product.kilominimo}`);
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

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    // Eliminar productos que ya no están en el archivo
    const productNames = new Set(cleanProducts.map((p) => p.nombre));
    const productsToDelete = await Product.find({ nombre: { $nin: [...productNames] } }, "_id");

    if (productsToDelete.length > 0) {
      const idsToDelete = productsToDelete.map((p) => p._id);
      await Product.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).json({
      message: "Productos actualizados y sincronizados exitosamente",
      nuevosOActualizados: cleanProducts.length,
      eliminados: productsToDelete.length,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: `Error de tipo de dato. Revisá que columnas como 'precio' y 'descuento' contengan solo números. Detalle: ${error.message}`,
      });
    }
    console.error("Error interno:", error);
    res.status(500).json({ message: "Error interno al procesar el archivo" });
  }
};

// Obtener productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};
