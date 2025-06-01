import { Router } from "express";
import { isMinorista } from "../middlewares/isMinorista.js";
import { authRequired } from "../middlewares/authRequired.js";


const router = Router()


router.get("/minorista", authRequired, isMinorista,  (req, res) => {
 
  });



export default router;