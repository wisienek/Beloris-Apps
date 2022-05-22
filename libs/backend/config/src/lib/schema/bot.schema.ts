import * as Joi from 'joi';

export const botSchema = Joi.object({
  id: Joi.string().min(16).max(64).required(),
  callback: Joi.string().min(10).required(),
  secret: Joi.string().min(16).max(64).required(),
});
