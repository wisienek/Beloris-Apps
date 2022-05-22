import * as Joi from 'joi';

import { EnvEnum } from '@bella/shared';

export const envSchema = Joi.string()
  .valid({ ...EnvEnum })
  .required();
