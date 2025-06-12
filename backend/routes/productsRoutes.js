// Tu archivo de rutas (ej. routes/productsRoutes.js)

import { Router } from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/productsController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { getProducts } from "../controllers/productsController.js";

const router = Router();
const storage = multer.memoryStorage();

// --- 1. PRIMERO SE DEFINE LA FUNCIÓN DE FILTRADO ---
const fileFilter = (req, file, cb) => {
  // Comprueba si el nombre del archivo termina en .xlsx o .csv
  if (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.csv')) {
    cb(null, true); // Acepta el archivo
  } else {
    // Rechaza el archivo con un error
    cb(new Error('Formato de archivo no válido. Solo se permiten .xlsx y .csv'), false);
  }
};

// --- 2. LUEGO SE USA LA FUNCIÓN AL CONFIGURAR MULTER ---
const upload = multer({ storage: storage, fileFilter: fileFilter });


// --- 3. FINALMENTE, SE USA 'upload' EN LA RUTA ---
// Ruta para productos minoristas
router.post("/:type/upload", authRequired, isAdmin, upload.single("file"), uploadExcel);
router.get("/productos", getProducts);

/* // Rutas para productos mayoristas (comentadas como en tu original)
router.post("/wholesale/upload",authRequired,isAdmin,upload.single("file"),uploadWholesaleExcel);
router.get("/wholesale/productos", getWholesaleProducts); */

export default router;