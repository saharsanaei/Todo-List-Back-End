import express from 'express';

import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];


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