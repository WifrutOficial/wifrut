import { Router } from "express";
import { isMinorista } from "../middlewares/isMinorista.js";
import { authRequired } from "../middlewares/authRequired.js";


const router = Router()

//todavia no tengo un controlador definido solo QUIERO PROTEGER LA RUTA
router.get("/minorista", authRequired, isMinorista,  (req, res) => {
    // Tu lógica para la ruta mayorista
  });



export default router;