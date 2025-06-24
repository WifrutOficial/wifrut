import { Router } from "express";
import {
  postProduct,
  getUserOrders,
  actualizarEstadoPedido,
} from "../controllers/orderController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { isMinorista } from "../middlewares/isMinorista.js";

const router = Router();

// 🧾 Clientes (minoristas)
router.post("/create", authRequired, isMinorista, postProduct);
router.get("/repetir-pedido", authRequired, isMinorista, getUserOrders);

// ✅ Admin (sin middleware)
router.put("/estado", actualizarEstadoPedido);

export default router;
