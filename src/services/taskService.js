import { getTasksByUser, getTasksByCategory, getTaskById, addTask, updateTask, deleteTask } from '../models/Task.js';
import { getDailyProgress, getWeeklyProgress } from '../models/Progress.js';
import pool from '../core/configs/database.js';


const addTaskService = async (userId, title, description, due_date, priority, category_id) => {
  try {
    console.log('Adding task with data:', { userId, title, description, due_date, priority, category_id });
    const task = await addTask(userId, title, description, due_date, priority, category_id);
    console.log('Task added successfully:', task);
    return task;
  } catch (error) {
    console.error('Error in addTaskService:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

const deleteTaskService = async (taskId, userId) => {
  try {
    console.log('Deleting task in service:', taskId, 'for user:', userId);
    const deletedTask = await deleteTask(taskId, userId);
    
    if (!deletedTask) {
      throw new Error('Task not found or user unauthorized');
    }

    // Fetch updated progress after deletion
    const dailyProgress = await getDailyProgress(userId);
    const weeklyProgress = await getWeeklyProgress(userId);

    console.log('Updated progress after deletion:', { daily: dailyProgress, weekly: weeklyProgress });

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
  
const updateTaskService = async (taskId, userId, category_id, title, description, due_date, priority) => {
    try {
        console.log('updateTaskService called with:', { taskId, userId, category_id, title, description, due_date, priority });
        const task = await updateTask(taskId, userId, category_id, title, description, due_date, priority);
        console.log('Task updated in database:', task);
        
        const progress = await addProgress(task.task_id, 'update');
        if (!progress) {
            console.warn('Failed to add progress, but task was updated');
        }
        
        return task;
    } catch (error) {
        console.error('Error in updateTaskService:', error);
        console.error('Error stack:', error.stack);
        throw new Error(`Failed to update task: ${error.message}`);
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