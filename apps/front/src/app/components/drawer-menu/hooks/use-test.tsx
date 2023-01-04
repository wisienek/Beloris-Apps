import { useState } from 'react';
import axios from 'axios';
import { ApiRoutes } from '@bella/data';

export const useTest = () => {
  const [testing, setTesting] = useState<boolean>(false);

  const sendTestAuth = () => {
    setTesting(true);

    axios({
      method: 'get',
      url: ApiRoutes.ROLES_TEST,
      withCredentials: true,
    })
      .then((data) => {
        console.log(`Finished axios`, data);
      })
      .catch(console.error)
      .finally(() => setTesting(false));
  };

  return { sendTestAuth, testing };
};
