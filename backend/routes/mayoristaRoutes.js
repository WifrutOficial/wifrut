import { Router } from "express";
import { isMayorista } from "../middlewares/isMayorista.js";
import {isAprobado} from "../middlewares/isAprobado.js"
import { authRequired } from "../middlewares/authRequired.js";

const router = Router()

//todavia no tengo un controlador definido solo QUIERO PROTEGER LA RUTA
router.get("/mayorista", authRequired, isMayorista, isAprobado,  (req, res) => {
  res.json({ message: "Acceso permitido al panel mayorista" });
  });


export default router;