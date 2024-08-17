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
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if there are any tasks associated with this category
    const taskCheckResult = await client.query(
      'SELECT COUNT(*) FROM Task WHERE category_id = $1 AND user_id = $2',
      [categoryId, userId]
    );

    if (taskCheckResult.rows[0].count > 0) {
      throw new Error('Cannot delete category with associated tasks');
    }

    const result = await client.query(
      'DELETE FROM Category WHERE category_id = $1 AND user_id = $2 RETURNING *',
      [categoryId, userId]
    );

    await client.query('COMMIT');

    if (result.rows.length === 0) {
      throw new Error('Category not found or user unauthorized');
    }

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateCategory = async (categoryId, userId, name) => {
  const result = await pool.query(
      'UPDATE Category SET name = $1 WHERE category_id = $2 AND user_id = $3 RETURNING *',
      [name, categoryId, userId]
  );
  if (result.rows.length === 0) {
      throw new Error('Category not found or user unauthorized');
  }
  return result.rows[0];
};

export { createCategory, getCategories, deleteCategory, updateCategory };