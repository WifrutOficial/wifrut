import { Router } from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/productsController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { getProducts } from "../controllers/productsController.js";
import {
  uploadWholesaleExcel,
  getWholesaleProducts,
} from "../controllers/productsController.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para productos minoristas
router.post("/:type/upload",authRequired,isAdmin,upload.single("file"),uploadExcel);
router.get("/productos", getProducts);

// Rutas para productos mayoristas
router.post("/wholesale/upload",authRequired,isAdmin,upload.single("file"),uploadWholesaleExcel);
router.get("/wholesale/productos", getWholesaleProducts);

export default router;
