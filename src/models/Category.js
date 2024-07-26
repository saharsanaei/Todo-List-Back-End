import pool from '../core/configs/database.js';

const createCategory = async (name) => {
    const result = await pool.query(
        'INSERT INTO Category (name) VALUES ($1) RETURNING category_id, name',
        [name]
    );
    return result.rows[0];
};

const getCategories = async () => {
    const result = await pool.query('SELECT * FROM Category');
    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const result = await pool.query('SELECT * FROM Category WHERE category_id = $1', [categoryId]);
    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }
    return result.rows[0];
};

export { createCategory, getCategories, getCategoryById };
