import { registerUser, loginUser } from '../../services/userService.js';

const register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const { user, token } = await registerUser(username, password, email);
        res.json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const { user, token } = await loginUser(username, password);
        res.json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export { register, login };