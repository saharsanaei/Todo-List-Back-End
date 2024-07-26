import { body } from 'express-validator';

const taskValidations = [
    body('title').isLength({ min: 1 }).withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('due_date').optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
    body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be pending or completed')
];

const userValidations = {
    register: [
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
        body('email').isEmail().withMessage('Email must be valid')
    ],
    login: [
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    ]
};

export { taskValidations, userValidations };
