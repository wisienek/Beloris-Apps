import * as React from 'react';
import { Box, Skeleton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useFetch from 'react-fetch-hook';

import { FileListDto, VersionDto } from '@bella/dto';
import { ApiRoutes } from '../../api/api-routes.enum';
import Title from './title';

const columns: GridColDef[] = [
  { field: 'uuid', headerName: 'ID', width: 50, align: 'right' },
  { field: 'savePath', headerName: 'Lokacja', width: 300 },
  { field: 'name', headerName: 'Nazwa', flex: 10 },
  { field: 'fileAction', headerName: 'Zmiana', width: 100 },
  { field: 'required', headerName: 'Zmienić?', width: 100, type: 'boolean' },
];

export interface MyTableArguments {
  version: VersionDto;
}

export default function MyTable(args: MyTableArguments) {
  const filesFetch = useFetch<FileListDto>(
    ApiRoutes.FILE_LIST(args?.version?.major, args?.version?.minor),
  );

  React.useEffect(() => {
    console.log(filesFetch.isLoading, filesFetch.data);
  }, [filesFetch.isLoading]);

  return (
    <React.Fragment>
      {filesFetch?.isLoading && (
        <>
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" />
        </>
      )}
      {filesFetch?.isLoading === false && filesFetch?.data && (
        <>
          <Title>Pliki do pobrania</Title>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filesFetch.data.files.map((f) => {
                return { ...f, id: f.id };
              })}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        </>
      )}
    </React.Fragment>
  );
}
