import * as Joi from 'joi';

import { EnvEnum } from '@bella/enums';

export const envSchema = Joi.string()
  .valid({ ...EnvEnum })
  .required();
