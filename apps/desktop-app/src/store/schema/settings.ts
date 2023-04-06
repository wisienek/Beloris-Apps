import { Schema } from 'conf/dist/source/types';
import { JSONSchemaFormat, JSONSchemaType } from 'json-schema-typed';
import { UserSettings } from '@bella/schema';

export const SettingsSchema: Schema<UserSettings> = {
  version: {
    type: JSONSchemaType.Object,
    required: ['currentVersion', 'downloadedDate', 'omittedFilesUUIDS'],
    properties: {
      currentVersion: {
        type: JSONSchemaType.Object,
        required: [
          'major',
          'minor',
          'uuid',
          'isCurrent',
          'createdAt',
          'updatedAt',
        ],
        properties: {
          major: {
            type: JSONSchemaType.Integer,
            minimum: 0,
            maximum: 9999,
            default: 0,
          },
          minor: {
            type: JSONSchemaType.Integer,
            minimum: 0,
            maximum: 9999,
            default: 0,
          },
          uuid: {
            type: [JSONSchemaType.String, JSONSchemaType.Null],
            format: JSONSchemaFormat.UUID,
            default: null,
          },
          isCurrent: {
            type: [JSONSchemaType.Boolean, JSONSchemaType.Null],
            default: null,
          },
          createdAt: {
            type: [JSONSchemaType.String, JSONSchemaType.Null],
            format: JSONSchemaFormat.DateTime,
            default: null,
          },
          updatedAt: {
            type: [JSONSchemaType.String, JSONSchemaType.Null],
            format: JSONSchemaFormat.DateTime,
            default: null,
          },
        },
      },
      downloadedDate: {
        type: [JSONSchemaType.String, JSONSchemaType.Null],
        format: JSONSchemaFormat.DateTime,
        default: null,
      },
      omittedFilesUUIDS: {
        type: [JSONSchemaType.Array, JSONSchemaType.Null],
        items: {
          type: JSONSchemaType.String,
          format: JSONSchemaFormat.UUID,
        },
        default: null,
      },
    },
  },
  downloadTo: {
    type: JSONSchemaType.Object,
    required: ['mcFolder', 'modpackFolder'],
    properties: {
      mcFolder: {
        type: [JSONSchemaType.String, JSONSchemaType.Null],
        default: null,
      },
      modpackFolder: {
        type: [JSONSchemaType.String, JSONSchemaType.Null],
        default: null,
      },
    },
  },
};

export const SettingsDefaults: UserSettings = {
  version: {
    currentVersion: {
      major: 0,
      minor: 0,
      isCurrent: null,
      createdAt: null,
      updatedAt: null,
    },
    downloadedDate: null,
    omittedFilesUUIDS: null,
  },
  downloadTo: {
    mcFolder: null,
    modpackFolder: null,
  },
};
