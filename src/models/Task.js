import pool from '../core/configs/database.js';

const getTasksByUser = async (userId) => {
    const result = await pool.query('SELECT * FROM Task WHERE user_id = $1', [userId]);
    return result.rows;
};

const getTasksByCategory = async (categoryId) => {
    const result = await pool.query('SELECT * FROM Task WHERE category_id = $1', [categoryId]);
    return result.rows;
};

const getTaskById = async (taskId, userId) => {
    const result = await pool.query('SELECT * FROM Task WHERE task_id = $1 AND user_id = $2', [taskId, userId]);
    if (result.rows.length === 0) {
        throw new Error('Task not found');
    }
    return result.rows[0];
};

const addTask = async (userId, categoryId, title, description, due_date, priority, status) => {
    const result = await pool.query(
        'INSERT INTO Task (user_id, category_id, title, description, due_date, priority, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [userId, categoryId, title, description, due_date, priority, status]
    );
    return result.rows[0];
};

const updateTask = async (taskId, userId, categoryId, title, description, due_date, priority, status) => {
    const result = await pool.query(
        'UPDATE Task SET category_id = $1, title = $2, description = $3, due_date = $4, priority = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE task_id = $7 AND user_id = $8 RETURNING *',
        [categoryId, title, description, due_date, priority, status, taskId, userId]
    );
    if (result.rows.length === 0) {
        throw new Error('Task not found or user unauthorized');
    }
    return result.rows[0];
};

const deleteTask = async (taskId, userId) => {
    const result = await pool.query('DELETE FROM Task WHERE task_id = $1 AND user_id = $2 RETURNING *', [taskId, userId]);
    if (result.rows.length === 0) {
        throw new Error('Task not found or user unauthorized');
    }
    return result.rows[0];
};

export { getTasksByUser, getTasksByCategory, getTaskById, addTask, updateTask, deleteTask };
