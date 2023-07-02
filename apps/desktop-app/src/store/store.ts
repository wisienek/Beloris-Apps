import * as _Store from 'electron-store';
import schema from './schema';

export const Store = new _Store({
  schema,
});
