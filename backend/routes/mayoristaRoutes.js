import { Router } from "express";
import { isMayorista } from "../middlewares/isMayorista.js";
import { authRequired } from "../middlewares/authRequired.js";
const router = Router()

//todavia no tengo un controlador definido solo QUIERO PROTEGER LA RUTA
router.get("/mayorista", authRequired, isMayorista,  (req, res) => {
    // Tu lógica para la ruta mayorista
  });


export default router;