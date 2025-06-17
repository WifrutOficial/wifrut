// Tu archivo de rutas (ej. routes/productsRoutes.js)

import { Router } from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/productsController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { getProducts } from "../controllers/productsController.js";

const router = Router();
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

  if (file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
  
    cb(new Error('Formato de archivo no válido. Solo se permiten .xlsx y .csv'), false);
  }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });



router.post("/:type/upload", authRequired, isAdmin, upload.single("file"), uploadExcel);
router.get("/productos", getProducts);



export default router;