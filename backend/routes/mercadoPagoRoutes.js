import { Router } from "express";
import {
  createOrderAndPreference,
 
} from "../controllers/mercadoPagoController.js";

const router = Router();



router.post("/preference", createOrderAndPreference);


export default router;
