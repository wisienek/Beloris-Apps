import * as Joi from 'joi';

export const awsSchema = Joi.object({
  region: Joi.string().min(6).required(),
  bucket: Joi.string().min(3).required(),
  accessKey: Joi.string().min(6).required(),
  accessKeyId: Joi.string().min(6).required(),
});
