import * as Joi from 'joi';

export const appSchema = Joi.object({
  port: Joi.number().integer().positive().min(2999).max(9999).required(),
});
