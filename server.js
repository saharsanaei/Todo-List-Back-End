import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, param, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Configure PostgreSQL client
const { Pool } = pg;
const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Test database connection
app.get('/test-connection', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error', err.stack);
        res.status(500).json({ success: false, message: 'Database connection error', error: err.message });
    }
});

// User registration
app.post('/register',
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
    body('email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);

        try {
            const result = await pool.query(
                'INSERT INTO "User" (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username',
                [username, hashedPassword, email]
            );
            const user = result.rows[0];
            const token = jwt.sign({ id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'User registered successfully', token });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(400).json({ message: 'Error registering user', error: error.message });
        }
    });

// User login
app.post('/login',
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const result = await pool.query('SELECT user_id, username, password FROM "User" WHERE username = $1', [username]);
            if (result.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            const token = jwt.sign({ id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'User logged in successfully', token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    });

// Get all tasks (protected)
app.get('/task', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Task WHERE user_id = $1', [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

// Get a single task by ID (protected)
app.get('/task/:id', authenticateToken, 
    param('id').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskId = parseInt(req.params.id);
        try {
            const result = await pool.query('SELECT * FROM Task WHERE task_id = $1 AND user_id = $2', [taskId, req.user.id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error fetching task:', error);
            res.status(500).json({ message: 'Error fetching task', error: error.message });
        }
    });

// Add a new task (protected)
app.post('/task', authenticateToken,
    body('title').isString().notEmpty(),
    body('description').isString().optional(),
    body('due_date').isISO8601().optional(),
    body('priority').isInt({ min: 1, max: 5 }).optional(),
    body('status').isInt({ min: 0, max: 2 }).optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, due_date, priority, status } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO Task (user_id, title, description, due_date, priority, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [req.user.id, title, description, due_date, priority, status]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error adding task:', error);
            res.status(500).json({ message: 'Error adding task', error: error.message });
        }
    });

// Update a task (protected)
app.put('/task/:id', authenticateToken,
    param('id').isInt(),
    body('title').isString().notEmpty(),
    body('description').isString().optional(),
    body('due_date').isISO8601().optional(),
    body('priority').isInt({ min: 1, max: 5 }).optional(),
    body('status').isInt({ min: 0, max: 2 }).optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskId = parseInt(req.params.id);
        const { title, description, due_date, priority, status } = req.body;
        try {
            const result = await pool.query(
                'UPDATE Task SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE task_id = $6 AND user_id = $7 RETURNING *',
                [title, description, due_date, priority, status, taskId, req.user.id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Task not found or user unauthorized' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Error updating task', error: error.message });
        }
    });

// Delete a task (protected)
app.delete('/task/:id', authenticateToken,
    param('id').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const taskId = parseInt(req.params.id);
        try {
            const result = await pool.query('DELETE FROM Task WHERE task_id = $1 AND user_id = $2 RETURNING *', [taskId, req.user.id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Task not found or user unauthorized' });
            }
            res.json({ message: 'Task deleted successfully', task: result.rows[0] });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Error deleting task', error: error.message });
        }
    });

// Get all categories for a user (protected)
app.get('/category', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Category WHERE user_id = $1', [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// Add a new category (protected)
app.post('/category', authenticateToken,
    body('name').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO Category (user_id, name) VALUES ($1, $2) RETURNING *',
                [req.user.id, name]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).json({ message: 'Error adding category', error: error.message });
        }
    });

// Update a category (protected)
app.put('/category/:id', authenticateToken,
    param('id').isInt(),
    body('name').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const categoryId = parseInt(req.params.id);
        const { name } = req.body;
        try {
            const result = await pool.query(
                'UPDATE Category SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE category_id = $2 AND user_id = $3 RETURNING *',
                [name, categoryId, req.user.id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Category not found or user unauthorized' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Error updating category', error: error.message });
        }
    });

// Delete a category (protected)
app.delete('/category/:id', authenticateToken,
    param('id').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const categoryId = parseInt(req.params.id);
        try {
            const result = await pool.query('DELETE FROM Category WHERE category_id = $1 AND user_id = $2 RETURNING *', [categoryId, req.user.id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Category not found or user unauthorized' });
            }
            res.json({ message: 'Category deleted successfully', category: result.rows[0] });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Error deleting category', error: error.message });
        }
    });

// Get user progress (protected)
app.get('/progress', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Progress WHERE user_id = $1 ORDER BY date DESC LIMIT 7', [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
});

// Update user progress (protected)
app.post('/progress', authenticateToken,
    body('weekly_progress').isInt({ min: 0, max: 100 }),
    body('daily_progress').isInt({ min: 0, max: 100 }),
    body('date').isISO8601(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { weekly_progress, daily_progress, date } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO Progress (user_id, weekly_progress, daily_progress, date) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, date) DO UPDATE SET weekly_progress = $2, daily_progress = $3 RETURNING *',
                [req.user.id, weekly_progress, daily_progress, date]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error updating progress:', error);
            res.status(500).json({ message: 'Error updating progress', error: error.message });
        }
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Database pool has ended');
        process.exit(0);
    });
});