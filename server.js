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

app.get('/tasks', (req, res) => {
  res.json(tasks);
});


app.post('/tasks', (req, res) => {
    const newTask = req.body.task;
     if (!newTask) {
    return res.status(400).json({ message: 'Task content is required' });
  }
  tasks.push(newTask);
  res.json({ message: 'Task added successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});