import XLSX from "xlsx";
import iconv from "iconv-lite"; // ✅ nuevo import
import { Product } from "../models/products.js";

export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    // ✅ Decodificamos correctamente el buffer a UTF-8
    const decodedBuffer = iconv.decode(req.file.buffer, "utf8");
    const workbook = XLSX.read(decodedBuffer, { type: "string" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return res.status(400).json({ message: "El archivo de Excel está vacío o no tiene hojas." });
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      return res.status(400).json({ message: `La hoja '${sheetName}' no se pudo encontrar o está vacía.` });
    }

    const productsFromExcel = XLSX.utils.sheet_to_json(sheet, { raw: true });

    const cleanProducts = productsFromExcel.map((product) => {
      const cleanedProduct = {};
      for (const key in product) {
        if (key && !key.startsWith("__") && product[key] !== null && product[key] !== "") {
          const cleanedKey = key.trim().toLowerCase();
          const cleanedValue = typeof product[key] === "string" ? product[key].trim() : product[key];
          cleanedProduct[cleanedKey] = cleanedValue;
        }
      }
      return cleanedProduct;
    }).filter(p => p.nombre);

    const bulkOps = cleanProducts.map((product) => {
      const updateFields = { ...product };

      if (product.tipoventa) {
        const tipoVentaRecibido = String(product.tipoventa).toLowerCase().trim();

        if (tipoVentaRecibido.includes("kilo")) {
          updateFields.tipoVenta = "kilo";
        } else if (tipoVentaRecibido.includes("unidad")) {
          updateFields.tipoVenta = "unidad";
        } else if (tipoVentaRecibido.includes("litro")) {
          updateFields.tipoVenta = "litro";
        } else {
          console.warn(`ADVERTENCIA: tipoVenta no reconocido ('${product.tipoventa}') para '${product.nombre}'. Se asignará 'unidad' por defecto.`);
          updateFields.tipoVenta = "unidad";
        }
      } else {
        updateFields.tipoVenta = "unidad";
      }

      let precio = Number(product.precio);
      if (isNaN(precio)) {
        console.warn(`ADVERTENCIA: Precio inválido ('${product.precio}') para el producto '${product.nombre}'. Se establecerá en 0.`);
        precio = 0;
      }

      const descuento = Number(product.descuento);

      updateFields.descripcion = product.descripcion || null;

      if (!isNaN(descuento) && descuento > 0) {
        updateFields.precioConDescuento = precio - (precio * descuento) / 100;
      } else {
        updateFields.precioConDescuento = precio;
      }

      if (product.kilominimo !== undefined) {
        const kiloMin = Number(product.kilominimo);
        if ([0.5, 0.25, 0.2, 1, 2, 3].includes(kiloMin)) {
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

    const productNamesFromExcel = new Set(cleanProducts.map(p => p.nombre));
    const productsToDelete = await Product.find({ nombre: { $nin: [...productNamesFromExcel] } }, '_id');

    if (productsToDelete.length > 0) {
      const idsToDelete = productsToDelete.map(p => p._id);
      await Product.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).json({
      message: "Productos actualizados y sincronizados exitosamente",
      nuevosOActualizados: cleanProducts.length,
      eliminados: productsToDelete.length,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: `Error de tipo de dato en el archivo. Revisa que las columnas como 'precio' y 'descuento' solo contengan números. Detalle: ${error.message}`
      });
    }
    res.status(500).json({ message: "Error interno al procesar el archivo" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};
