import Joi from 'joi';

const taskSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().allow(''),
    due_date: Joi.date().iso(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    status: Joi.string().valid('pending', 'completed')
});

const userSchema = {
    register: Joi.object({
        name: Joi.string().min(5).required(),
        username: Joi.string().min(3).required(),
        password: Joi.string().min(5).required(),
        email: Joi.string().email().required()
    }),
    login: Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(5).required()
    })
};

export { taskSchema, userSchema };