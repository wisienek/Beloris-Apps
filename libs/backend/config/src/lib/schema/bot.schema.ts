import * as Joi from 'joi';

export const botSchema = Joi.object({
  id: Joi.string().min(16).max(64).required(),
  redirectUri: Joi.string().min(5).required(),
  secret: Joi.string().min(16).max(64).required(),
});
