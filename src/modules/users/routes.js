import express from 'express';
import { register, login } from './controllers.js';
import { userValidations } from '../../core/middlewares/validators.js';

const router = express.Router();

router.post('/register', userValidations.register, register);
router.post('/login', userValidations.login, login);

export default router;