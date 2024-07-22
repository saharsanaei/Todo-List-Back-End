import express from 'express';
import { body } from 'express-validator';
import { register, login } from './controllers.js';

const router = express.Router();

router.post('/register',
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
    body('email').isEmail(),
    register
);

router.post('/login',
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
    login
);

export default router;