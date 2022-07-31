import React, { FC, ChangeEvent, useState } from 'react';
import useFetch from 'react-fetch-hook';
import * as _ from 'lodash';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  CardHeader,
  Skeleton,
} from '@mui/material';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { DownloaderFileDto, FileListDto, VersionDto } from '@bella/shared';
import { ApiRoutes } from '../../api/api-routes.enum';

interface FileTableV2WrapperProps {
  version: VersionDto;
  filesToDownload: DownloaderFileDto[];
  setFilesToDownload: (files: DownloaderFileDto[]) => void;
  toggleFileToDownload: (
    event: React.ChangeEvent,
    file: DownloaderFileDto,
  ) => void;
}

interface FileTableV2Props {
  data: FileListDto;
  filesToDownload: DownloaderFileDto[];
  toggleFileToDownload: (
    event: React.ChangeEvent,
    file: DownloaderFileDto,
  ) => void;
}

interface Filters {
  status?: FileActionsType;
}

const FileActions = {
  DOWNLOAD: 'download',
  MODIFY: 'modify',
  DELETE: 'delete',
} as const;

type FileActionsType = typeof FileActions[keyof typeof FileActions];

const getStatusLabel = (status: FileActionsType): JSX.Element => {
  const map = {
    [FileActions.DELETE]: {
      text: 'Usuń',
      element: <DeleteForeverOutlinedIcon color="error" />,
    },
    [FileActions.DOWNLOAD]: {
      text: 'Pobierz',
      element: <FileDownloadOutlinedIcon color="info" />,
    },
    [FileActions.MODIFY]: {
      text: 'Modyfikuj',
      element: <MoreHorizOutlinedIcon color="warning" />,
    },
  };
  const { text, element }: any = map[status];

  return (
    <Tooltip arrow title={text} placement="right">
      {element}
    </Tooltip>
  );
};

const applyFilters = (
  files: DownloaderFileDto[],
  filters: Filters,
): DownloaderFileDto[] => {
  return files.filter(
    (file) => !(filters.status && file.fileAction !== filters.status),
  );
};

const applyPagination = (
  files: DownloaderFileDto[],
  page: number,
  limit: number,
): DownloaderFileDto[] => {
  return files.slice(page * limit, page * limit + limit);
};

function FileTableV2Container({
  version,
  filesToDownload,
  setFilesToDownload,
  toggleFileToDownload,
}: FileTableV2WrapperProps) {
  const filesFetch = useFetch<FileListDto>(
    ApiRoutes.FILE_LIST(version?.major, version?.minor),
  );

  const rows = React.useMemo(
    () => filesFetch?.data ?? { version: null, files: [] },
    [filesFetch.data],
  );

  React.useEffect(() => {
    setFilesToDownload(filesFetch.data?.files ?? []);
  }, [filesFetch.data]);

  return (
    <>
      {filesFetch?.isLoading && (
        <>
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" />
        </>
      )}
      {filesFetch?.isLoading === false && filesFetch?.data && (
        <FileTableV2
          data={rows}
          filesToDownload={filesToDownload}
          toggleFileToDownload={toggleFileToDownload}
        />
      )}
    </>
  );
}

const FileTableV2: FC<FileTableV2Props> = ({
  data,
  filesToDownload,
  toggleFileToDownload,
}) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'Wszystkie',
    },
    {
      id: FileActions.MODIFY,
      name: 'Modyfikacje',
    },
    {
      id: FileActions.DELETE,
      name: 'Usuwanie',
    },
    {
      id: FileActions.DOWNLOAD,
      name: 'Pobieranie',
    },
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredFiles = applyFilters(data.files, filters);
  const paginatedFiles = applyPagination(filteredFiles, page, limit);

  return (
    <Card>
      <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Zmiana</InputLabel>
              <Select
                value={filters.status || 'all'}
                onChange={handleStatusChange}
                label="Status"
                autoWidth
              >
                {statusOptions.map((statusOption) => (
                  <MenuItem key={statusOption.id} value={statusOption.id}>
                    {statusOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
        title="Lista plików"
      />

      <Divider />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  color="text.primary"
                >
                  id
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  color="text.primary"
                >
                  Lokacja
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  color="text.primary"
                >
                  Nazwa
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  color="text.primary"
                >
                  Rozmiar
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  color="text.primary"
                >
                  Zmiana
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography
                  fontWeight="bold"
                  variant="body1"
                  color="text.primary"
                >
                  Zastosować?
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedFiles.map((file) => {
              const isFileSelected = _.includes(filesToDownload, file);
              return (
                <TableRow hover key={file.uuid}>
                  <TableCell>
                    <Typography variant="body1" color="text.primary" noWrap>
                      {file.uuid.split('-')[0]}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" color="text.primary" noWrap>
                      {file.savePath}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {file.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {file.fileSize.toPrecision(2)} Mb
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {getStatusLabel(file.fileAction)}
                  </TableCell>

                  <TableCell align="center">
                    <Checkbox
                      color="primary"
                      disabled={file.required}
                      defaultChecked={file.required}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        toggleFileToDownload(event, file)
                      }
                      value={isFileSelected}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredFiles.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
          labelRowsPerPage="Rzędów na stronę:"
          labelDisplayedRows={(options) =>
            `${options.from}/${options.to}, max ${options.count}`
          }
        />
      </Box>
    </Card>
  );
};

export default FileTableV2Container;
