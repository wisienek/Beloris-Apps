import * as React from 'react';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserContext } from '../combined/use-user';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`,
);

const DiscordIdentity = () => {
  const { user } = React.useContext(UserContext);
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

  return user.id ? (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        px={2}
        py={2}
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
          <Typography variant="subtitle2" noWrap>
            {getPremiumType(user.premium_type)}
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <></>
  );
};

export default DiscordIdentity;
