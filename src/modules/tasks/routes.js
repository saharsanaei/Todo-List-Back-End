import express from 'express';
import { getAllTasks, getTask, createTask, updateTaskById, deleteTaskById } from './controllers.js';
import authenticateToken from '../../core/middlewares/authenticateToken.js';
import { taskValidations } from '../../core/middlewares/validators.js';

const router = express.Router();

router.get('/', authenticateToken, getAllTasks);
router.get('/:id', authenticateToken, getTask);

router.post('/', authenticateToken, taskValidations, createTask);

router.put('/:id', authenticateToken, taskValidations, updateTaskById);

router.delete('/:id', authenticateToken, deleteTaskById);

export default router;