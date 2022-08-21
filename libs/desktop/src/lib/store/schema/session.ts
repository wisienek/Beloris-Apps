import { JSONSchemaType } from 'json-schema-typed';
import { TokenDto } from '@bella/dto';

export const SessionSchema = {
  access_token: {
    type: [JSONSchemaType.String, JSONSchemaType.Null],
    default: null,
  },
  expires_in: {
    type: [JSONSchemaType.String, JSONSchemaType.Null],
    default: null,
  },
  scope: {
    type: [JSONSchemaType.String, JSONSchemaType.Null],
    default: null,
  },
  state: {
    type: [JSONSchemaType.String, JSONSchemaType.Null],
    default: null,
  },
  token_type: {
    type: [JSONSchemaType.String, JSONSchemaType.Null],
    default: null,
  },
};

export const SessionDefaults: TokenDto = {
  access_token: null,
  expires_in: null,
  scope: null,
  state: null,
  token_type: null,
};
