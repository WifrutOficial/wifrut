import { Router } from "express";
import { cambiarEstadoAprobado } from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { obtenerSolicitudesMayoristas } from "../controllers/adminController.js";
import { getMayoristasAprobados } from "../controllers/adminController.js";
import { obtenerDatosMayorista } from "../controllers/adminController.js";

const router = Router();

// Ruta para aprobar
router.put("/aprobar-mayorista/:id", authRequired, isAdmin, cambiarEstadoAprobado);

//ruta para obtener mayoristas SOLO LOS APROBADOS
router.get(
  "/mayoristas-aprobados",
  authRequired,
  isAdmin,
  getMayoristasAprobados
);

// Ruta para obtener las SOLICITUDES PENDIENTES de mayoristas
router.get(
  "/solicitudes-mayoristas",
  authRequired,
  isAdmin,
  obtenerSolicitudesMayoristas
);

router.get(
  "/obtener-datos-mayorista",
  authRequired,
  isAdmin,
  obtenerDatosMayorista
);

export default router;
