import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('Progress route');
});

export default router;