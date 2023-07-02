import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { NavbarOptionsDto } from '@bella/dto';
import { ApiRoutes } from '@bella/data';
import { UserContext } from '../../context/user-context';

export const useNavbar = () => {
  const { user } = useContext(UserContext);

  const [navbarOptions, setNavbarOptions] = useState<NavbarOptionsDto>({});

  const getNavbar = async () => {
    try {
      axios
        .get<NavbarOptionsDto>(ApiRoutes.NAVBAR_OPTIONS, {
          withCredentials: true,
        })
        .then(({ data: optionsData }) => setNavbarOptions(optionsData))
        .catch((err) => console.error(`some axios error`, err));
    } catch (error) {
      console.error(`Error przy fetchowaniu dodatkowych opcji nawigacji`, error);
    }
  };

  useEffect(() => {
    getNavbar();
  }, [user]);

  return { navbarOptions };
};
