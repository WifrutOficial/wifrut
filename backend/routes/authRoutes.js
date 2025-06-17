import { Router } from "express";
import { postRegister, postLogin, logout ,} from "../controllers/Controllers.js";


const router = Router();

router.post("/register", postRegister);
router.post("/login", postLogin);
router.post("/logout", logout);
 
export default router;
