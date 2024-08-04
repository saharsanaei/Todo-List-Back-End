import pool from '../core/configs/database.js';

const createCategory = async (name, userId) => {
  const result = await pool.query(
    'INSERT INTO Category (name, user_id) VALUES ($1, $2) RETURNING category_id, name',
    [name, userId]
  );
  return result.rows[0];
};

const getCategories = async (userId) => {
  const result = await pool.query('SELECT * FROM Category WHERE user_id = $1', [userId]);
  return result.rows;
};

const deleteCategory = async (categoryId, userId) => {
  const result = await pool.query('DELETE FROM Category WHERE category_id = $1 AND user_id = $2 RETURNING *', [categoryId, userId]);
  if (result.rows.length === 0) {
    throw new Error('Category not found or user unauthorized');
  }
  return result.rows[0];
};

export { createCategory, getCategories, deleteCategory };