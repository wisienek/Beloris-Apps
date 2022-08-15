import * as React from 'react';
import { Role } from 'discord.js';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';

import { UserContext } from './use-user';
import Tooltip from '../single/tooltip';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`,
);

const DiscordIdentity = () => {
  const { user, belorisMemberRoles, belorisAdminRoles, logout } =
    React.useContext(UserContext);
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

  const getPrimaryRole = (roles: Role[]) => {
    if (!roles || roles.length === 0) return <>brak roli...</>;

    const role = roles
      .filter((r) => !r.managed)
      .sort((a, b) => a.position - b.position)[0];

    return (
      <Chip
        key={role.id}
        color="secondary"
        label={role.name}
        size="small"
        sx={{ marginRight: '.3rem' }}
      />
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
            {getPrimaryRole(belorisAdminRoles ?? belorisMemberRoles)} |{' '}
            <span>{getPremiumType(user.premium_type)}</span>
          </Typography>
        </Box>
        <Box
          ml="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Tooltip
            title="Wyloguj"
            arrow
            TransitionComponent={Zoom}
            placement="top"
          >
            <IconButton
              aria-label="logout"
              sx={{ color: '#F6F6F6' }}
              onClick={() => logout()}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  ) : (
    <></>
  );
};

export default DiscordIdentity;
