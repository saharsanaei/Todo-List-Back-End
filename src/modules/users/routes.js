import express from 'express';
import { register, login } from './controllers.js';
import joiValidator from '../../core/middlewares/joiValidator.js';
import { userSchema } from '../../core/middlewares/validator.js';

const router = express.Router();

router.post('/register', joiValidator(userSchema.register), register);
router.post('/login', joiValidator(userSchema.login), login);

// Define your token verification logic here
router.post('/verify-token', (req, res) => {
    const token = req.body.token;
    // Add your token verification logic here
    if (token) {
      res.status(200).send({ message: 'Token is valid' });
    } else {
      res.status(400).send({ message: 'Invalid token' });
    }
  });

export default router;