import * as React from 'react';
import { Avatar, Box, Chip, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';

import { UserContext } from '../combined/use-user';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`,
);

const DiscordIdentity = () => {
  const {
    user,
    belorisMember,
    belorisAdminMember,
    belorisMemberRoles,
    belorisAdminRoles,
  } = React.useContext(UserContext);
  const theme = useTheme();

  const getPremiumType = (type: number) => {
    switch (type) {
      case 0:
        return 'Brak premium';
      case 1:
        return 'Klasyczne premium';
      case 2:
        return 'Full premium';
      default:
        return '...';
    }
  };

  const getRoles = () => {
    if (!belorisMemberRoles) return <></>;

    return [...(belorisAdminRoles ?? []), ...(belorisMemberRoles ?? [])].map(
      (role) => <Chip key={role.id} color="secondary" label={role.name} />,
    );
  };

  return user.id ? (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        px={1.5}
        py={1}
        mt={1}
        sx={{
          backgroundColor: '#424549',
          color: '#F6F6F6',
          borderRadius: '2rem',
          boxShadow: theme.shadows[10],
        }}
      >
        <AvatarWrapper
          alt={`${user.username}`}
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
        />
        <Box
          sx={{
            ml: 1.5,
          }}
        >
          <Typography variant="h5" noWrap>
            {user.username}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            Technik | <span>{getPremiumType(user.premium_type)}</span>
          </Typography>
        </Box>
        <Box
          ml="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <LogoutIcon />
        </Box>
      </Box>
    </Box>
  ) : (
    <></>
  );
};

export default DiscordIdentity;
