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
  const { title, description, due_date, priority, category_id } = req.body;
  try {
    console.log('Received task data:', req.body); // Log received data
    const task = await addTaskService(req.user.id, title, description, due_date, priority, category_id);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

const deleteTaskById = async (req, res) => {
  try {
    const task = await deleteTaskService(req.params.id, req.user.id);
    res.json(task);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

const updateTaskById = async (req, res) => {
    const { title, description, due_date, priority, status } = req.body;
    try {
        const task = await updateTaskService(req.params.id, req.user.id, title, description, due_date, priority, status);
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

export { getAllTasks, getTask, createTask, updateTaskById, deleteTaskById };