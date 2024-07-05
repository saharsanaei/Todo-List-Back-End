import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];

// Function to generate a unique ID for each task
const generateId = () => {
  return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
};

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Get a single task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const newTask = req.body.task;
  if (!newTask) {
    return res.status(400).json({ message: 'Task content is required' });
  }
  const task = { id: generateId(), content: newTask };
  tasks.push(task);
  res.json({ message: 'Task added successfully!', task });
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedContent = req.body.task;
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (!updatedContent) {
    return res.status(400).json({ message: 'Updated task content is required' });
  }
  tasks[taskIndex].content = updatedContent;
  res.json({ message: 'Task updated successfully!', task: tasks[taskIndex] });
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
