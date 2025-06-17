import { Router } from "express";
import { isMayorista } from "../middlewares/isMayorista.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();



router.post(
  "/guardar-datos-mayorista",
  authRequired,
  isMayorista,

);

export default router;
