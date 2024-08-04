import express from 'express';
import { createCategory, getCategories, deleteCategory } from './categoryController.js';
import authenticateToken from '../../core/middlewares/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createCategory);
router.get('/', authenticateToken, getCategories);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;