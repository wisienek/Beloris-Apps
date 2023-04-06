import { JSONSchemaType } from 'json-schema-typed';
import { StoreKeys } from '../store-keys.enum';

import { SettingsDefaults, SettingsSchema } from './settings';
import { SessionDefaults, SessionSchema } from './session';

export default {
  [StoreKeys.SETTINGS]: {
    type: JSONSchemaType.Object,
    required: ['version', 'downloadTo'],
    properties: SettingsSchema,
    default: SettingsDefaults,
  },
  [StoreKeys.SESSION]: {
    type: JSONSchemaType.Object,
    required: ['access_token', 'expires_in', 'scope', 'state', 'token_type'],
    properties: SessionSchema,
    default: SessionDefaults,
  },
};
