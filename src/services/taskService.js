import { getTasksByUser, getTasksByCategory, getTaskById, addTask, updateTask, deleteTask } from '../models/Task.js';
import { getDailyProgress, getWeeklyProgress } from '../models/Progress.js';
import pool from '../core/configs/database.js';


const addTaskService = async (userId, title, description, due_date, priority, category_id) => {
  try {
    const task = await addTask(userId, title, description, due_date, priority, category_id);
    const dailyProgress = await getDailyProgress(userId);
    const weeklyProgress = await getWeeklyProgress(userId);
    return { task, progress: { daily: dailyProgress, weekly: weeklyProgress } };
  } catch (error) {
    console.error('Error in addTaskService:', error);
    throw error;
  }
};

const deleteTaskService = async (taskId, userId) => {
  try {
    const deletedTask = await deleteTask(taskId, userId);
    const dailyProgress = await getDailyProgress(userId);
    const weeklyProgress = await getWeeklyProgress(userId);
    return {
      task: deletedTask,
      progress: {
        daily: dailyProgress,
        weekly: weeklyProgress
      }
    };
  } catch (error) {
    console.error('Error in deleteTaskService:', error);
    throw error;
  }
};
  
const updateTaskService = async (taskId, userId, title, description, due_date, priority, category_id) => {
  try {
    const updatedTask = await updateTask(taskId, userId, title, description, due_date, priority, category_id);
    
    const dailyProgress = await getDailyProgress(userId);
    const weeklyProgress = await getWeeklyProgress(userId);

    return {
      task: updatedTask,
      progress: {
        daily: dailyProgress,
        weekly: weeklyProgress
      }
    };
  } catch (error) {
    console.error('Error in updateTaskService:', error);
    throw error;
  }
};

const markTaskAsCompleted = async (taskId, userId, isCompleted) => {
  try {
    const result = await pool.query(
      'UPDATE Task SET is_completed = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2 AND user_id = $3 RETURNING *',
      [isCompleted, taskId, userId]
    );
    if (result.rows.length === 0) {
      throw new Error('Task not found or user unauthorized');
    }
    const dailyProgress = await getDailyProgress(userId);
    const weeklyProgress = await getWeeklyProgress(userId);
    return {
      task: result.rows[0],
      progress: {
        daily: dailyProgress,
        weekly: weeklyProgress
      }
    };
  } catch (error) {
    console.error('Error in markTaskAsCompleted:', error);
    throw error;
  }
};

export { getTasksByUser, getTasksByCategory, getTaskById, addTaskService, updateTaskService, deleteTaskService, markTaskAsCompleted };