import { createCategory as addCategory, getCategories as fetchCategories, deleteCategory as removeCategory, updateCategory as modifyCategory } from '../../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const category = await addCategory(name, userId);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await fetchCategories(userId);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.id;
    await removeCategory(categoryId, userId);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.message === 'Cannot delete category with associated tasks') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  }
};

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryId = req.params.id;
        const userId = req.user.id;
        const category = await modifyCategory(categoryId, userId, name);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};