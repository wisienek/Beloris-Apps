import React, { FC, ChangeEvent, useState } from 'react';
import * as _ from 'lodash';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
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
import { DownloaderFileDto, FileListDto } from '@bella/dto';
import { FileAction } from '@bella/enums';

interface FileTableV2WrapperProps {
  filesdto: FileListDto;
  filesToDownload: DownloaderFileDto[];
  setFilesToDownload: (files: DownloaderFileDto[]) => void;
  toggleFileToDownload: (event: React.ChangeEvent, file: DownloaderFileDto) => void;
}

interface FileTableV2Props {
  data: FileListDto;
  filesToDownload: DownloaderFileDto[];
  toggleFileToDownload: (event: React.ChangeEvent, file: DownloaderFileDto) => void;
}

interface Filters {
  status?: FileActionType;
}

type FileActionType = typeof FileAction[keyof typeof FileAction];

const getStatusLabel = (status: FileActionType): JSX.Element => {
  const map: Record<FileAction, { text: string; element: JSX.Element }> = {
    [FileAction.DELETE]: {
      text: 'Usuń',
      element: <DeleteForeverOutlinedIcon color="error" />,
    },
    [FileAction.DOWNLOAD]: {
      text: 'Pobierz',
      element: <FileDownloadOutlinedIcon color="info" />,
    },
    [FileAction.MODIFY]: {
      text: 'Modyfikuj',
      element: <MoreHorizOutlinedIcon color="warning" />,
    },
  };

  const { text, element } = map[status];

  return (
    <Tooltip arrow title={text} placement="right">
      {element}
    </Tooltip>
  );
};

const applyFilters = (files: DownloaderFileDto[], filters: Filters): DownloaderFileDto[] => {
  return files.filter((file) => !(filters.status && file.fileAction !== filters.status));
};

const applyPagination = (files: DownloaderFileDto[], page: number, limit: number): DownloaderFileDto[] => {
  return files.slice(page * limit, page * limit + limit);
};

function FileTableV2Container({
  filesdto,
  filesToDownload,
  setFilesToDownload,
  toggleFileToDownload,
}: FileTableV2WrapperProps) {
  const rows = React.useMemo(() => filesdto ?? { version: null, files: [] }, [filesdto]);

  React.useEffect(() => {
    setFilesToDownload(filesdto?.files ?? []);
  }, [filesdto]);

  return (
    <>
      {!filesdto ? (
        <>
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" />
        </>
      ) : (
        <FileTableV2 data={rows} filesToDownload={filesToDownload} toggleFileToDownload={toggleFileToDownload} />
      )}
    </>
  );
}

const FileTableV2: FC<FileTableV2Props> = ({ data, filesToDownload, toggleFileToDownload }) => {
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
      id: FileAction.MODIFY,
      name: 'Modyfikacje',
    },
    {
      id: FileAction.DELETE,
      name: 'Usuwanie',
    },
    {
      id: FileAction.DOWNLOAD,
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
    <>
      <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Zmiana</InputLabel>
              <Select value={filters.status || 'all'} onChange={handleStatusChange} label="Status" autoWidth>
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
                <Typography fontWeight="bold" variant="body1" color="text.primary">
                  id
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="bold" variant="body1" color="text.primary">
                  Lokacja
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="bold" variant="body1" color="text.primary">
                  Nazwa
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight="bold" variant="body1" color="text.primary">
                  Rozmiar
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography fontWeight="bold" variant="body1" color="text.primary">
                  Zmiana
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography fontWeight="bold" variant="body1" color="text.primary">
                  Zastosować?
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedFiles.map((file) => {
              const isFileSelected = _.includes(filesToDownload, file);
              return (
                <TableRow hover key={file.id}>
                  <TableCell>
                    <Typography variant="body1" color="text.primary" noWrap>
                      {file.id.split('-')[0]}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" color="text.primary" noWrap>
                      {file.savePath}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" color="text.primary" gutterBottom noWrap>
                      {file.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" color="text.primary" gutterBottom noWrap>
                      {file?.fileSize || `idk`} Mb
                    </Typography>
                  </TableCell>

                  <TableCell align="center">{getStatusLabel(file.fileAction)}</TableCell>

                  <TableCell align="center">
                    <Checkbox
                      color="primary"
                      disabled={file.required}
                      defaultChecked={file.required}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => toggleFileToDownload(event, file)}
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
          labelDisplayedRows={(options) => `${options.from}/${options.to}, max ${options.count}`}
        />
      </Box>
    </>
  );
};

export default FileTableV2Container;
