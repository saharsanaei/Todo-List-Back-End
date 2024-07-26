import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../core/secrets/jwt.js';
import { createUser, findUserByUsername } from '../models/User.js';

const generateToken = (userId, username) => {
    return jwt.sign({ id: userId, username }, JWT_SECRET);
};

const registerUser = async (username, password, email) => {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await createUser(username, hashedPassword, email);
    const token = generateToken(user.user_id, username);
    return { user, token };
};

const loginUser = async (username, password) => {
    const user = await findUserByUsername(username);
    if (!user) {
        throw new Error('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }
    const token = generateToken(user.user_id, user.username);
    return { user, token };
};

export { registerUser, loginUser };