import * as React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
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
      <Box display="flex" alignItems="center" pb={1} mt={1}>
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
