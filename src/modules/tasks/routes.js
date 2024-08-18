import express from 'express';
import { getAllTasks, getTask, createTask, updateTaskById, deleteTaskById, markTaskAsCompleted } from './controllers.js';
import authenticateToken from '../../core/middlewares/authenticateToken.js';
import joiValidator from '../../core/middlewares/joiValidator.js';
import { taskSchema } from '../../core/middlewares/validator.js';

const router = express.Router();

router.get('/', authenticateToken, getAllTasks);
router.get('/:id', authenticateToken, getTask);
router.post('/', authenticateToken, joiValidator(taskSchema), createTask);
router.put('/:id', authenticateToken, joiValidator(taskSchema), updateTaskById);
router.delete('/:id', authenticateToken, deleteTaskById);
router.put('/:id/complete', authenticateToken, markTaskAsCompleted);

export default router;