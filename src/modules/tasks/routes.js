import express from 'express';
import { body } from 'express-validator';
import { getAllTasks, getTask, createTask, updateTaskById, deleteTaskById } from './controllers.js';
import authenticateToken from '../../core/middlewares/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, getAllTasks);
router.get('/:id', authenticateToken, getTask);

router.post('/',
    authenticateToken,
    body('title').isLength({ min: 1 }),
    createTask
);

router.put('/:id',
    authenticateToken,
    body('title').isLength({ min: 1 }),
    updateTaskById
);

router.delete('/:id', authenticateToken, deleteTaskById);

export default router;