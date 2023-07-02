import { ReactNode, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Toolbar,
  List,
  Divider,
  IconButton,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Avatar,
} from '@mui/material';
import { Menu, ChevronLeft } from '@mui/icons-material/';
import SettingsIcon from '@mui/icons-material/Settings';
import { MainListItems, SecondaryListItems } from '../molecules/list-items';
import Bg from '../../../../assets/images/background.png';
import { UserContext } from '../../context/user-context';
import { AppBar } from '../../single/app-bar';
import { Drawer } from '../../single/drawer';

const mdTheme = createTheme();

const OuterLayerDrawer = ({ children }: { children: ReactNode }) => {
  const { user, belorisAdminMember } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
              ...(!open ? { justifyContent: 'space-between' } : { justifyContent: 'flex-end' }),
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <Menu />
            </IconButton>

            <Link to="/settings">
              {user ? (
                <Avatar
                  alt={user.username}
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
                ></Avatar>
              ) : (
                <IconButton sx={{ color: mdTheme.palette.common.white }}>
                  <SettingsIcon />
                </IconButton>
              )}
            </Link>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeft />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems />
            {user ? (
              <>
                <Divider sx={{ my: 1 }} />
                <SecondaryListItems user={user} adminMember={belorisAdminMember} />
              </>
            ) : (
              <></>
            )}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            display: 'flex',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            marginTop: '64px',
            flexGrow: 1,
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${Bg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default OuterLayerDrawer;
