import pool from '../core/configs/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../core/secrets/jwt.js';

// Generate a JWT token based on the user's username
const generateToken = (username) => {
    return jwt.sign({ username }, JWT_SECRET);
};

const registerUser = async (username, password, email) => {
    const hashedPassword = await bcrypt.hash(password, 8);
    const token = generateToken(username); // Generate token based on username

    const result = await pool.query(
        'INSERT INTO "User" (username, password, email, token) VALUES ($1, $2, $3, $4) RETURNING user_id, username, token',
        [username, hashedPassword, email, token]
    );

    const user = result.rows[0];
    return { user, token };
};

const loginUser = async (username, password) => {
    const result = await pool.query('SELECT user_id, username, password, token FROM "User" WHERE username = $1', [username]);
    if (result.rows.length === 0) {
        throw new Error('Invalid username or password');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    const token = user.token; // Use the stored token
    return { user, token };
};

export { registerUser, loginUser };
