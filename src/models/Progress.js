import pool from '../core/configs/database.js';

const getDailyProgress = async (userId) => {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE is_completed = true) AS completed_tasks,
      COUNT(*) AS total_tasks
    FROM Task
    WHERE user_id = $1 AND DATE(due_date) = CURRENT_DATE
  `, [userId]);
 
  const { completed_tasks, total_tasks } = result.rows[0];
  const percentage = total_tasks > 0 ? (completed_tasks / total_tasks) * 100 : 0;
 
  return {
    percentage: Math.round(percentage),
    completed: parseInt(completed_tasks),
    total: parseInt(total_tasks)
  };
};

const getWeeklyProgress = async (userId) => {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE is_completed = true) AS completed_tasks,
      COUNT(*) AS total_tasks
    FROM Task
    WHERE user_id = $1 AND created_at >= DATE_TRUNC('week', CURRENT_DATE)
  `, [userId]);
 
  const { completed_tasks, total_tasks } = result.rows[0];
  const percentage = total_tasks > 0 ? (completed_tasks / total_tasks) * 100 : 0;
 
  return {
    percentage: Math.round(percentage),
    completed: completed_tasks,
    total: total_tasks
  };
};

export { getDailyProgress, getWeeklyProgress };