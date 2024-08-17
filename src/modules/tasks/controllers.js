import { getTasksByUser, getTaskById, addTaskService, updateTaskService, deleteTaskService, markTaskAsCompleted } from '../../services/taskService.js';
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
    const result = await deleteTaskService(taskId, userId);
    if (!result.task) {
      return res.status(404).json({ message: 'Task not found or you are not authorized to delete this task' });
    }
    res.json({
      message: 'Task deleted successfully',
      task: result.task,
      progress: result.progress
    });
  } catch (error) {
    console.error('Error in deleteTaskById:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

const updateTaskById = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, due_date, priority, category_id } = req.body;

  try {
    console.log('Updating task:', { taskId, userId, title, description, due_date, priority, category_id });

    // Validate the incoming data
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      'UPDATE Task SET title = $1, description = $2, due_date = $3, priority = $4, category_id = $5, updated_at = CURRENT_TIMESTAMP WHERE task_id = $6 AND user_id = $7 RETURNING *',
      [title, description, due_date, priority, category_id, taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or user unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

const handleMarkTaskAsCompleted = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { is_completed } = req.body;
  try {
    const result = await markTaskAsCompleted(taskId, userId, is_completed);
    res.json(result);
  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ message: 'Error marking task as completed', error: error.message });
  }
};

export { getAllTasks, getTask, createTask, updateTaskById, deleteTaskById, handleMarkTaskAsCompleted as markTaskAsCompleted };