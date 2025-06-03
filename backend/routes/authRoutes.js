import { Router } from "express";
import { postRegister, postLogin, logout ,} from "../controllers/Controllers.js";

//manejador de rutas
const router = Router();

router.post("/register", postRegister);
//router.get("/register/mayoristas", getMayoristas);
router.post("/login", postLogin);
router.post("/logout", logout);
 
export default router;
