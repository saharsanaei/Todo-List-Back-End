import { addProgress, getProgressByTask, getProgressByCategory } from '../../models/Progress.js';
import express from 'express';

const router = express.Router();

router.post('/progress', async (req, res) => {
  const { taskId, action } = req.body;
  try {
    const progress = await addProgress(taskId, action);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add progress' });
    res.send('Progress created');
  }
});

router.get('/progress/task/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const progress = await getProgressByTask(taskId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

router.get('/progress/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    const progress = await getProgressByCategory(categoryId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;