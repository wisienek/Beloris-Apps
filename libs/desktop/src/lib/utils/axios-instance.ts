import axios from 'axios';
import { Store, StoreKeys } from '../store';
import { TokenDto } from '@bella/dto';

export const getInstance = () => {
  const session = Store.get(StoreKeys.SESSION) as unknown as TokenDto;

  const instance = axios.create({
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    config.headers.common['Cookie'] = `DISCORD_TOKEN=${encodeURI(
      JSON.stringify(session),
    )};`;
    return config;
  });

  return instance;
};
