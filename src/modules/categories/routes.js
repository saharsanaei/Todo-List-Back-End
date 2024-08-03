import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all categories');
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (name) {
    res.status(201).json({ category_id: Date.now(), name });
  } else {
    res.status(400).send('Category name is required');
  }
});

export default router;