import { getTasksByUser, getTasksByCategory, getTaskById, addTask, updateTask, deleteTask } from '../models/Task.js';
import { addProgress } from '../models/Progress.js';

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
    const task = await deleteTask(taskId, userId);
    return task;
  } catch (error) {
    console.error('Error in deleteTaskService:', error);
    throw error;
  }
};

const updateTaskService = async (taskId, userId, title, description, due_date, priority, category_id) => {
  const task = await updateTask(taskId, userId, category_id, title, description, due_date, priority, 'incomplete');
  await addProgress(task.task_id, 'update');
  return task;
};

export { getTasksByUser, getTasksByCategory, getTaskById, addTaskService, updateTaskService, deleteTaskService };