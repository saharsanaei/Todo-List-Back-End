import express from 'express';
import { register, login } from './controllers.js';
import joiValidator from '../../core/middlewares/joiValidator.js';
import { userSchema } from '../../core/middlewares/validator.js';

const router = express.Router();

router.post('/register', joiValidator(userSchema.register), register);
router.post('/login', joiValidator(userSchema.login), login);

export default router;