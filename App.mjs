import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/modules/users/routes.js';
import taskRoutes from './src/modules/tasks/routes.js';
import categoriesRouter from './src/modules/categories/routes.js';
import progressRouter from './src/modules/progresses/routes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN
}));

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/progress', progressRouter);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/tasks', progressRouter);


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });  