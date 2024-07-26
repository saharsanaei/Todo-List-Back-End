import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../core/secrets/jwt.js';
import { createUser, findUserByUsername } from '../models/User.js';

// Generate a JWT token based on the user's username
const generateToken = (username) => {
    return jwt.sign({ username }, JWT_SECRET);
};

const registerUser = async (username, password, email) => {
    const hashedPassword = await bcrypt.hash(password, 8);
    const token = generateToken(username); // Generate token based on username

    const user = await createUser(username, hashedPassword, email, token);
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

    const token = user.token; // Use the stored token
    return { user, token };
};

export { registerUser, loginUser };
