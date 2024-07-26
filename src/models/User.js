import pool from '../core/configs/database.js';

const createUser = async (username, password, email) => {
    const result = await pool.query(
        'INSERT INTO "User" (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username',
        [username, password, email]
    );
    return result.rows[0];
};

const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT user_id, username, password FROM "User" WHERE username = $1', [username]);
    return result.rows[0];
};

export { createUser, findUserByUsername };