import { getTasksByUser, getTaskById, addTaskService, updateTaskService, deleteTaskService } from '../../services/taskService.js';
import pool from '../../core/configs/database.js';

const getAllTasks = async (req, res) => {
    try {
        const tasks = await getTasksByUser(req.user.id);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

const getTask = async (req, res) => {
    try {
        const task = await getTaskById(req.params.id, req.user.id);
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(404).json({ message: 'Task not found', error: error.message });
    }
};

const createTask = async (req, res) => {
  try {
    console.log('Received task data:', req.body);
    const { title, description, due_date, priority, category_id } = req.body;
    const userId = req.user.id;
    console.log('Creating task for user:', userId);
    
    const task = await addTaskService(userId, title, description, due_date, priority, category_id);
    console.log('Task created successfully:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error in createTask:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

const deleteTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    console.log('Deleting task:', taskId, 'for user:', userId);
    const task = await deleteTaskService(taskId, userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you are not authorized to delete this task' });
    }
    res.json({ message: 'Task deleted successfully', task });
  } catch (error) {
    console.error('Error in deleteTaskById:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

const updateTaskById = async (req, res) => {
    const { title, description, due_date, priority, category_id } = req.body;
    const taskId = req.params.id;
    const userId = req.user.id;

    try {
        console.log('Updating task:', { taskId, userId, title, description, due_date, priority, category_id });
        const task = await updateTaskService(taskId, userId, category_id, title, description, due_date, priority);
        console.log('Task updated successfully:', task);
        res.json(task);
    } catch (error) {
        console.error('Error in updateTaskById:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Error updating task',
            error: error.message,
            stack: error.stack,
            details: error.toString()
        });
    }
};

const markTaskAsCompleted = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { is_completed } = req.body;

  try {
    const result = await pool.query(
      'UPDATE Task SET is_completed = $1, updated_at = CURRENT_TIMESTAMP WHERE task_id = $2 AND user_id = $3 RETURNING *',
      [is_completed, taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or user unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ message: 'Error marking task as completed', error: error.message });
  }
};

export { getAllTasks, getTask, createTask, updateTaskById, deleteTaskById, markTaskAsCompleted };