import * as Joi from 'joi';

export const dbSchema = Joi.object({
  host: Joi.string().min(6).required(),
  port: Joi.number().integer().positive().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(30).required(),
  database: Joi.string().min(3).max(30).required(),
});
