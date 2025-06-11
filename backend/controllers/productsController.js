import XLSX from "xlsx";
import { Product } from "../models/products.js";

export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    
    // MEJORA: Verificar que el Excel tenga al menos una hoja.
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return res.status(400).json({ message: "El archivo de Excel está vacío o no tiene hojas." });
    }
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    console.log(`Procesando datos de la hoja: '${sheetName}'`);

    // MEJORA: Asegurarse de que la hoja no esté vacía antes de procesar.
    if (!sheet) {
      return res.status(400).json({ message: `La hoja '${sheetName}' no se pudo encontrar o está vacía.` });
    }

    const productsFromExcel = XLSX.utils.sheet_to_json(sheet, { raw: true });

    const cleanProducts = productsFromExcel.map((product) => {
      const cleanedProduct = {};
      for (const key in product) {
        if (key && !key.startsWith("__") && product[key] !== null && product[key] !== "") {
          // MEJORA: Normalizar los nombres de las columnas a minúsculas para evitar errores (ej. "Precio" vs "precio").
          const cleanedKey = key.trim().toLowerCase();
          const cleanedValue = typeof product[key] === "string" ? product[key].trim() : product[key];
          cleanedProduct[cleanedKey] = cleanedValue;
        }
      }
      return cleanedProduct;
    }).filter(p => p.nombre); // MEJORA: Filtrar filas que no tengan un nombre de producto.

    // --- PROCESO DE ACTUALIZACIÓN Y CREACIÓN (UPSERT) ---
    const bulkOps = cleanProducts.map((product) => {
      const updateFields = { ...product };

      // MEJORA: Validación de precio robusta para evitar errores de 'NaN'.
      let precio = Number(product.precio);
      if (isNaN(precio)) {
        console.warn(`ADVERTENCIA: Precio inválido ('${product.precio}') para el producto '${product.nombre}'. Se establecerá en 0.`);
        precio = 0; // Asigna un valor por defecto para evitar que la operación falle.
      }

      const descuento = Number(product.descuento);

      updateFields.descripcion = product.descripcion || null;

      // Cálculo del precio con descuento usando el precio ya validado.
      if (!isNaN(descuento) && descuento > 0) {
        updateFields.precioConDescuento = precio - (precio * descuento) / 100;
      } else {
        updateFields.precioConDescuento = precio;
      }

      // Validación de kiloMinimo.
      if (product.kilominimo !== undefined) { // Clave en minúsculas por la normalización
        const kiloMin = Number(product.kilominimo);
        if ([0.5, 1].includes(kiloMin)) {
          updateFields.kiloMinimo = kiloMin;
        } else {
          console.warn(`Valor de kiloMinimo no válido para ${product.nombre}: ${product.kilominimo}`);
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
    
    // --- PROCESO DE ELIMINACIÓN MÁS EFICIENTE ---
    // MEJORA: Usar Sets para una comparación mucho más rápida, especialmente con muchos productos.
    const productNamesFromExcel = new Set(cleanProducts.map(p => p.nombre));
    const productsToDelete = await Product.find({ nombre: { $nin: [...productNamesFromExcel] } }, '_id');

    if (productsToDelete.length > 0) {
      const idsToDelete = productsToDelete.map(p => p._id);
      await Product.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Se eliminaron ${idsToDelete.length} productos que ya no estaban en el Excel.`);
    }

    res.status(200).json({
      message: "Productos actualizados y sincronizados exitosamente",
      nuevosOActualizados: cleanProducts.length,
      eliminados: productsToDelete.length,
    });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    // MEJORA: Devolver un mensaje de error más específico si es un CastError.
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Error de tipo de dato en el archivo. Revisa que las columnas como 'precio' y 'descuento' solo contengan números. Detalle: ${error.message}` });
    }
    res.status(500).json({ message: "Error interno al procesar el archivo" });
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