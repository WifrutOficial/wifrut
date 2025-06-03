import { Router } from "express";
import {postProduct , getUserOrders } from "../controllers/orderController.js"
import {authRequired} from "../middlewares/authRequired.js"
import { isMinorista } from "../middlewares/isMinorista.js";


const router = Router()
router.post("/create", authRequired , isMinorista, postProduct)
router.get("/repetir-pedido",authRequired , isMinorista, getUserOrders )


export default router;