import 'dotenv/config';

import { Configuration } from './configuration.type';

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
  aws: {
    region: process.env.AWS_REGION,
    fileBucket: process.env.AWS_UPLOADER_DATA_BUCKET,
    accessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
  bot: {
    id: process.env.BOT_CLIENTID,
    callback: process.env.BOT_CALLBACK,
    secret: process.env.BOT_CLIENTSECRET,
  },
  envType: process.env.ENV_TYPE,
});
