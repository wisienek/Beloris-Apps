import axios from 'axios';
import { Store, StoreKeys } from '../store';
import { TokenDto } from '@bella/dto';
import { CookiesEnum } from '@bella/enums';

export const getInstance = () => {
  const instance = axios.create({
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const session = Store.get(StoreKeys.SESSION) as unknown as TokenDto;

    config.headers.common['Cookie'] = `${CookiesEnum.DISCORD_TOKEN}=${encodeURI(JSON.stringify(session))};`;
    return config;
  });

  return instance;
};
