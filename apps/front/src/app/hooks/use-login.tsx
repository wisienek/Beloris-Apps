import { useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { ApiRoutes } from '@bella/data';

import { ErrorSeverity } from '../components/single/error-message';
import { UserContext } from '../components/combined/use-user';
import { ErrorContext } from '../components/combined/error-box';

export const useLogin = () => {
  const { addError } = useContext(ErrorContext);
  const { verifyUser } = useContext(UserContext);
  const cookies = new Cookies();

  const login = async () => {
    try {
      const { data: userToken } = await window.api.session.getSession();

      cookies.set('DISCORD_TOKEN', userToken, { path: '/' });

      const { data: userData } = await axios.get(ApiRoutes.USER, {
        withCredentials: true,
      });
      if (!userData) throw new Error(`Brak autoryzacji`);

      verifyUser(userData);

      addError(
        ErrorSeverity.SUCCESS,
        `Zalogowano na konto: ${userData.username}`,
        true,
      );
    } catch (error) {
      await window.api.session.logout();
      console.error(`Error przy fetchowaniu usera (local)`, error);
    }
  };

  return { login };
};
