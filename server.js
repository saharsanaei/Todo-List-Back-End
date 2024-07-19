import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import pg from 'pg';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET; // Use the environment variable for JWT secret

// Configure PostgreSQL client
const { Pool } = pg;
const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
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

// User registration
app.post('/register',
    body('username').isLength({ min: 3 }), // Validate username length
    body('password').isLength({ min: 5 }), // Validate password length
    body('email').isEmail(), // Validate email format
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8); // Hash the password

        pool.query(
            'INSERT INTO "User" (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username',
            [username, hashedPassword, email],
            (error, results) => {
                if (error) {
                    return res.status(400).json({ message: 'Error registering user' });
                }
                const user = results.rows[0];
                const token = jwt.sign({ id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: 'User registered successfully', token });
            }
        );
    }
);

// User login
app.post('/login',
    body('username').isLength({ min: 3 }), // Validate username length
    body('password').isLength({ min: 5 }), // Validate password length
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        pool.query(
            'SELECT user_id, username, password FROM "User" WHERE username = $1',
            [username],
            (error, results) => {
                if (error || results.rows.length === 0) {
                    return res.status(400).json({ message: 'Invalid username or password' });
                }

                const user = results.rows[0];
                const isPasswordValid = bcrypt.compareSync(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ message: 'Invalid username or password' });
                }

                const token = jwt.sign({ id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: 'User logged in successfully', token });
            }
        );
    }
);

// Get all tasks (protected)
app.get('/tasks', authenticateToken, (req, res) => {
    pool.query('SELECT * FROM Task WHERE user_id = $1', [req.user.id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.json(results.rows);
    });
});

// Get a single task by ID (protected)
app.get('/tasks/:id', authenticateToken, (req, res) => {
    const taskId = parseInt(req.params.id);

    pool.query('SELECT * FROM Task WHERE task_id = $1 AND user_id = $2', [taskId, req.user.id], (error, results) => {
        if (error || results.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(results.rows[0]);
    });
});

// Add a new task (protected)
app.post('/tasks', authenticateToken, (req, res) => {
    const { title, description, due_date, priority, status } = req.body;
    const userId = req.user.id;

    pool.query(
        'INSERT INTO Task (user_id, title, description, due_date, priority, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING task_id, title, description, due_date, priority, status',
        [userId, title, description, due_date, priority, status],
        (error, results) => {
            if (error) {
                return res.status(400).json({ message: 'Error adding task' });
            }
            res.json({ message: 'Task added successfully', task: results.rows[0] });
        }
    );
});

// Update a task by ID (protected)
app.put('/tasks/:id', authenticateToken, (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, due_date, priority, status } = req.body;
    const userId = req.user.id;

    pool.query(
        'UPDATE Task SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE task_id = $6 AND user_id = $7 RETURNING task_id, title, description, due_date, priority, status',
        [title, description, due_date, priority, status, taskId, userId],
        (error, results) => {
            if (error || results.rows.length === 0) {
                return res.status(404).json({ message: 'Task not found or user unauthorized' });
            }
            res.json({ message: 'Task updated successfully', task: results.rows[0] });
        }
    );
});

// Delete a task by ID (protected)
app.delete('/tasks/:id', authenticateToken, (req, res) => {
    const taskId = parseInt(req.params.id);
    const userId = req.user.id;

    pool.query('DELETE FROM Task WHERE task_id = $1 AND user_id = $2 RETURNING task_id', [taskId, userId], (error, results) => {
        if (error || results.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found or user unauthorized' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});