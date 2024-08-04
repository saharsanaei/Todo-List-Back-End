import { createCategory as addCategory, getCategories as fetchCategories, deleteCategory as removeCategory } from '../../models/Category.js';

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
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};