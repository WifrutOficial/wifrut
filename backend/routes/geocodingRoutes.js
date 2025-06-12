// routes/geocodingRoutes.js
import { Router } from 'express';
import { buscarDireccion } from '../controllers/geocodingController.js';
import { authRequired } from '../middlewares/authRequired.js';

const router = Router();

// Definimos la ruta GET /api/geocode/buscar
// Usamos 'authRequired' para proteger el endpoint y evitar abusos
router.get('/buscar', authRequired, buscarDireccion);

export default router;