import 'dotenv/config';
import { Configuration } from './configuration.type';

// TODO: add validation schema (joi)
export default (): Configuration => ({
  app: {
    port: parseInt(process.env.PORT || '3333'),
  },
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  bot: {
    id: process.env.BOT_CLIENTID,
    callback: process.env.BOT_CALLBACK,
    secret: process.env.BOT_CLIENTSECRET,
  },
});
