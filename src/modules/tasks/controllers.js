import { getTasksByUser, getTaskById, addTaskService, updateTaskService, deleteTaskService } from '../../services/taskService.js';

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
    const { title, description, due_date, priority } = req.body;
    try {
        const task = await updateTaskService(req.params.id, req.user.id, title, description, due_date, priority);
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

export { getAllTasks, getTask, createTask, updateTaskById, deleteTaskById };