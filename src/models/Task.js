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

const addTask = async (userId, title, description, due_date, priority, category_id) => {
  try {
    const result = await pool.query(
      'INSERT INTO Task (user_id, title, description, due_date, priority, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, title, description, due_date, priority, category_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in addTask:', error.message);
    throw new Error('Could not add task');
  }
};

const updateTask = async (taskId, userId, title, description, due_date, priority, category_id, is_completed) => {
    try {
        const result = await pool.query(
            'UPDATE Task SET title = $1, description = $2, due_date = $3, priority = $4, category_id = $5, is_completed = $6, updated_at = CURRENT_TIMESTAMP WHERE task_id = $7 AND user_id = $8 RETURNING *',
            [title, description, due_date, priority, category_id, is_completed, taskId, userId]
        );

        if (result.rows.length === 0) {
            throw new Error('Task not found or user unauthorized');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error in updateTask:', error);
        throw error;
    }
};

const deleteTask = async (taskId, userId) => {
  try {
    console.log('Deleting task in model:', taskId, 'for user:', userId);
    const result = await pool.query('DELETE FROM Task WHERE task_id = $1 AND user_id = $2 RETURNING *', [Number(taskId), Number(userId)]);
    if (result.rows.length === 0) {
      throw new Error('Task not found or user unauthorized');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error in deleteTask model:', error);
    throw error;
  }
};

const markTaskAsCompleted = async (taskId, userId, isCompleted) => {
  const result = await pool.query(
    'UPDATE Task SET is_completed = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2 AND user_id = $3 RETURNING *',
    [isCompleted, taskId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Task not found or user unauthorized');
  }

  return result.rows[0];
};

export { getTasksByUser, getTasksByCategory, getTaskById, addTask, updateTask, deleteTask, markTaskAsCompleted };