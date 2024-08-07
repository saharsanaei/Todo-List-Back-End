import pool from '../core/configs/database.js';

const addProgress = async (taskId, action) => {
    try {
        const result = await pool.query(
            'INSERT INTO Progress (task_id, created_at) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *',
            [taskId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error in addProgress:', error.message);
        throw new Error('Could not add progress');
    }
};


const getProgressByTask = async (taskId) => {
    const result = await pool.query('SELECT * FROM Progress WHERE task_id = $1', [taskId]);
    return result.rows;
};

const getProgressByCategory = async (categoryId) => {
    const result = await pool.query(
        `SELECT p.* FROM Progress p
         JOIN Task t ON p.task_id = t.task_id
         WHERE t.category_id = $1`,
        [categoryId]
    );
    return result.rows;
};

export { addProgress, getProgressByTask, getProgressByCategory };
