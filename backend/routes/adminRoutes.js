import { Router } from "express";
import { cambiarEstadoAprobado } from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { obtenerSolicitudesMayoristas } from "../controllers/adminController.js";
import { getMayoristasAprobados } from "../controllers/adminController.js";
import { obtenerDatosMayorista } from "../controllers/adminController.js";

const router = Router();

router.put("/aprobar-mayorista/:id", authRequired, isAdmin, cambiarEstadoAprobado);


router.get(
  "/mayoristas-aprobados",
  authRequired,
  isAdmin,
  getMayoristasAprobados
);

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
