import { Router } from "express";

import { isAdmin } from "../middlewares/isAdmin.js";
import { authRequired } from "../middlewares/authRequired.js";
import { adminRouter } from "../controllers/adminController.js";

const router = Router()

router.post("/admin", authRequired, isAdmin, adminRouter  )

export default router;