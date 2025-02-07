import { Router } from "express";
import {postProduct} from "../controllers/orderController.js"
import {authRequired} from "../middlewares/authRequired.js"
import { isMinorista } from "../middlewares/isMinorista.js";

const router = Router()
router.post("/create",authRequired , isMinorista, postProduct)

export default router;