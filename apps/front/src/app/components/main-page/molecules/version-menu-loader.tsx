import { Grid, Skeleton } from '@mui/material';

const VersionMenuLoader = () => {
  return (
    <Grid
      container
      direction="row"
      alignItems="stretch"
      alignSelf="stretch"
      marginTop="auto"
      marginBottom="auto"
      height="100%"
    >
      {new Array(3).fill(null).map(() => (
        <Grid
          item
          sx={{
            width: '30%',
            height: '100%',
            ml: 'auto',
            mr: 'auto',
          }}
        >
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height="100%"
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default VersionMenuLoader;
