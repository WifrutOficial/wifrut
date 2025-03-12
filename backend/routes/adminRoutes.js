import { Router } from "express";
import { aprobarMayorista } from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { adminRouter } from "../controllers/adminController.js";
import { obtenerSolicitudesMayoristas } from "../controllers/adminController.js";

const router = Router();

router.post("/admin", authRequired, isAdmin, adminRouter); //esta no esta haciendo nada ahora

// Ruta para aprobar/rechazar mayoristas
router.put("/aprobar-mayorista/:id", authRequired, isAdmin, aprobarMayorista);

// Ruta para obtener las solicitudes pendientes de mayoristas
router.get(
  "/solicitudes-mayoristas",
  authRequired,
  isAdmin,
  obtenerSolicitudesMayoristas
);

export default router;
