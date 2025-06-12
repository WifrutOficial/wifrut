// routes/geocodingRoutes.js
import { Router } from 'express';
import { buscarDireccion } from '../controllers/geocodingController.js';
//import { authRequired } from '../middlewares/authRequired.js';

const router = Router();


router.get('/buscar',  buscarDireccion);

export default router;