import pool from '../core/configs/database.js';

const createUser = async (username, password, email, token) => {
    const result = await pool.query(
        'INSERT INTO "User" (username, password, email, token) VALUES ($1, $2, $3, $4) RETURNING user_id, username, token',
        [username, password, email, token]
    );
    return result.rows[0];
};

const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT user_id, username, password, token FROM "User" WHERE username = $1', [username]);
    return result.rows[0];
};

export { createUser, findUserByUsername };
