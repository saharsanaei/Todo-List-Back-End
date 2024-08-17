import { Router } from 'express';
import { getProgress } from './controllers.js';
import authenticateToken from '../../core/middlewares/authenticateToken.js';

const router = Router();

router.get('/', authenticateToken, getProgress);

export default router;