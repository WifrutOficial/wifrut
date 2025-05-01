import { Router } from "express";
import {postProduct} from "../controllers/orderController.js"
import {authRequired} from "../middlewares/authRequired.js"
import { isMinorista } from "../middlewares/isMinorista.js";
import { createNewOrder } from "../controllers/orderController.js";

const router = Router()
router.post("/create",authRequired , isMinorista, postProduct)

// Ruta para crear un nuevo pedido basado en uno existente
router.post("/nuevo-pedido", authRequired, createNewOrder);

export default router;