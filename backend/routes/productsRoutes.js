import { Router } from "express";
import multer from "multer";
import {uploadExcel} from "../controllers/productsController.js"
import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { getProducts } from "../controllers/productsController.js";

const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Ruta para subir productos desde un archivo Excel
router.post("/upload", authRequired, isAdmin, upload.single("file"), uploadExcel);

//ruta para obtener los archivos Excel y enviarlos al frontend
router.get("/productos", getProducts  )


export default router;