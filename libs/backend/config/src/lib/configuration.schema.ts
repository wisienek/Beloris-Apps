import * as Joi from 'joi';

import { appSchema, botSchema, dbSchema } from './schema';

export const configurationSchema = Joi.object({
  app: appSchema,
  db: dbSchema,
  bot: botSchema,
});
