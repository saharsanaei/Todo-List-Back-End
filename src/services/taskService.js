import pool from '../core/configs/database.js';

const getTasksByUser = async (userId) => {
    const result = await pool.query('SELECT * FROM Task WHERE user_id = $1', [userId]);
    return result.rows;
};

const getTaskById = async (taskId, userId) => {
    const result = await pool.query('SELECT * FROM Task WHERE task_id = $1 AND user_id = $2', [taskId, userId]);
    if (result.rows.length === 0) {
        throw new Error('Task not found');
    }
    return result.rows[0];
};

const addTask = async (userId, title, description, due_date, priority, status) => {
    const result = await pool.query(
        'INSERT INTO Task (user_id, title, description, due_date, priority, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, title, description, due_date, priority, status]
    );
    return result.rows[0];
};

const updateTask = async (taskId, userId, title, description, due_date, priority, status) => {
    const result = await pool.query(
        'UPDATE Task SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE task_id = $6 AND user_id = $7 RETURNING *',
        [title, description, due_date, priority, status, taskId, userId]
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

export { getTasksByUser, getTaskById, addTask, updateTask, deleteTask };