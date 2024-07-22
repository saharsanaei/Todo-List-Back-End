import pool from '../core/configs/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../core/secrets/jwt.js';

const registerUser = async (username, password, email) => {
    const hashedPassword = await bcrypt.hash(password, 8);
    const result = await pool.query(
        'INSERT INTO "User" (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username',
        [username, hashedPassword, email]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};

const loginUser = async (username, password) => {
    const result = await pool.query('SELECT user_id, username, password FROM "User" WHERE username = $1', [username]);
    if (result.rows.length === 0) {
        throw new Error('Invalid username or password');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};

export { registerUser, loginUser };