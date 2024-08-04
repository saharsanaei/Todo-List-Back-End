import { getTasksByUser, getTasksByCategory, getTaskById, addTask, updateTask, deleteTask } from '../models/Task.js';
import { addProgress } from '../models/Progress.js';

const addTaskService = async (userId, title, description, due_date, priority, category_id) => {
  const task = await addTask(userId, title, description, due_date, priority, category_id);
  await addProgress(task.task_id, 'add');
  return task;
};

const deleteTaskService = async (taskId, userId) => {
  const task = await deleteTask(taskId, userId);
  await addProgress(task.task_id, 'delete');
  return task;
};

const updateTaskService = async (taskId, userId, categoryId, title, description, due_date, priority, status) => {
    const task = await updateTask(taskId, userId, categoryId, title, description, due_date, priority, status);
    await addProgress(task.task_id, 'update');
    return task;
};

export { getTasksByUser, getTasksByCategory, getTaskById, addTaskService, updateTaskService, deleteTaskService };