import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/modules/users/routes.js';
import taskRoutes from './src/modules/tasks/routes.js';
import pool from './src/core/configs/database.js';
import createUserTable from './src/models/User.js';
import createTaskTable from './src/models/Task.js';
import createCategoryTable from './src/models/Category.js';
import createProgressTable from './src/models/Progress.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Initialize tables
const initTables = async () => {
    try {
        await pool.query(createUserTable);
        await pool.query(createTaskTable);
        await pool.query(createCategoryTable);
        await pool.query(createProgressTable);
        const alterUserTable = 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS token VARCHAR(255);';
        await pool.query(alterUserTable);
        console.log('Tables initialized');
    } catch (error) {
        console.error('Error initializing tables:', error);
    }
};

app.listen(port, () => {
    initTables();
    console.log(`Server is running on port ${port}`);
});