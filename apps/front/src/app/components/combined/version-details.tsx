import React from 'react';
import { DateTime } from 'luxon';

import { Avatar, Box, Grid, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import DownloadIcon from '@mui/icons-material/Download';

import { DownloaderFileDto, VersionDto } from '@bella/shared';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
      color: ${theme.palette.info.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.info};
`,
);

const ThemedGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  [theme.breakpoints.up('lg')]: {
    justifyContent: 'space-around',
  },
}));

export interface VersionDetailsArgs {
  fetchedVersion: VersionDto;
  downloadedVersion: VersionDto;
  fetchedFilesToDownload: DownloaderFileDto[];
  isSameVersion: boolean;
  error: Error;
  isLoading: boolean;
}

interface ComponentBoxArgs {
  icon: React.FC;
  primaryText: string;
  secondaryText: string;
}

const ComponentBox = (args: ComponentBoxArgs) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      sx={{
        px: 2,
      }}
      alignItems="center"
    >
      <AvatarSuccess
        sx={{
          mr: 2,
        }}
        theme={theme}
        variant="rounded"
      >
        <args.icon />
      </AvatarSuccess>
      <Box>
        <Typography variant="h5">{args.primaryText}</Typography>
        <Typography variant="h6" gutterBottom>
          {args.secondaryText}
        </Typography>
      </Box>
    </Box>
  );
};

const VersionDetails = ({
  fetchedVersion,
  fetchedFilesToDownload,
  downloadedVersion,
  isSameVersion,
  error,
  isLoading,
}: VersionDetailsArgs) => {
  const synthesizeVersionDate = (date: Date) =>
    DateTime.fromJSDate(date).setLocale('pl').toFormat('dd LLL yyyy');

  return (
    <ThemedGrid
      container
      direction="row"
      alignItems="stretch"
      alignSelf="stretch"
      marginTop="auto"
      marginBottom="auto"
    >
      <Grid item>
        {isLoading ?? error ? (
          <></>
        ) : (
          <ComponentBox
            primaryText={`Wersja ${downloadedVersion?.major ?? 0}.${
              downloadedVersion?.minor ?? 0
            }`}
            secondaryText={
              isSameVersion
                ? 'Aktualna'
                : `Nowa: ${fetchedVersion.major}.${fetchedVersion.minor}`
            }
            icon={() => {
              return isSameVersion ? (
                <CloudDoneIcon fontSize="large" />
              ) : (
                <DownloadIcon fontSize="large" />
              );
            }}
          />
        )}
      </Grid>
      <Grid item>
        {isLoading ?? error ? (
          <></>
        ) : (
          <ComponentBox
            primaryText={`${fetchedFilesToDownload.length}`}
            secondaryText="Zmian"
            icon={() => <InsertDriveFileIcon fontSize="large" />}
          />
        )}
      </Grid>
      <Grid item>
        {isLoading ?? error ? (
          <></>
        ) : (
          <ComponentBox
            primaryText={synthesizeVersionDate(
              new Date(fetchedVersion.updatedAt),
            )}
            secondaryText="Ostatnia zmiana"
            icon={() => <CalendarMonthIcon fontSize="large" />}
          />
        )}
      </Grid>
    </ThemedGrid>
  );
};

export default VersionDetails;
