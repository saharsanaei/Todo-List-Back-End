import express from 'express';
import { createCategory, getCategories, deleteCategory, updateCategory } from './controllers.js';
import authenticateToken from '../../core/middlewares/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createCategory);
router.get('/', authenticateToken, getCategories);
router.delete('/:id', authenticateToken, deleteCategory);
router.put('/:id', authenticateToken, updateCategory);

export default router;