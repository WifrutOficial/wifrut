import { Router } from "express";
import { isMayorista } from "../middlewares/isMayorista.js";
//import {isAprobado} from "../middlewares/isAprobado.js"
import { authRequired } from "../middlewares/authRequired.js";
//import { guardarDatosMayorista } from "../controllers/mayoristaController.js";

const router = Router();


//este controlador guarda los datos del formulario de esperando-aprobacion (mayorista)
router.post(
  "/guardar-datos-mayorista",
  authRequired,
  isMayorista,

);

export default router;
