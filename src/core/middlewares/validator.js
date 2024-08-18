import Joi from 'joi';

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  due_date: Joi.date().iso().allow(null),
  priority: Joi.number().integer().min(1).max(3),
  category_id: Joi.number().integer().required()
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