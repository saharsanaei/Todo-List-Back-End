import jwt from 'jsonwebtoken';
import JWT_SECRET from '../secrets/jwt.js';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = { id: user.id, username: user.username };
        next();
    });
};

export default authenticateToken;