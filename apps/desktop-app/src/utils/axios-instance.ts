import axios from 'axios';
import { Store, StoreKeys } from '../store';
import { TokenDto } from '@bella/dto';
import { CookiesEnum } from '@bella/enums';

export const getInstance = () => {
  const session = Store.get(StoreKeys.SESSION) as unknown as TokenDto;

  const instance = axios.create({
    withCredentials: true,
  });

  console.log(`Axios session:`, session);

  instance.interceptors.request.use((config) => {
    config.headers.common['Cookie'] = `${CookiesEnum.DISCORD_TOKEN}=${encodeURI(JSON.stringify(session))};`;
    return config;
  });

  return instance;
};
