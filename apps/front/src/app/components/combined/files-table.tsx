import React from 'react';

import { useTable } from 'react-table';
import {
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import useFetch from 'react-fetch-hook';

import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';

import { FileListDto, VersionDto } from '@bella/dto';

import { ApiRoutes } from '../../api/api-routes.enum';

export interface FileTableArgs {
  version: VersionDto;
}

const FileActions = {
  DOWNLOAD: 'download',
  MODIFY: 'modify',
  DELETE: 'delete',
} as const;

function FileTableContainer({ version }: FileTableArgs) {
  const filesFetch = useFetch<FileListDto>(
    ApiRoutes.FILE_LIST(version?.major, version?.minor),
  );

  const columns = React.useMemo(
    () => [
      { accessor: 'uuid', Header: 'ID' },
      { accessor: 'savePath', Header: 'Lokacja' },
      { accessor: 'name', Header: 'Nazwa' },
      { accessor: 'fileSize', Header: 'Rozmiar (Mb)' },
      { accessor: 'fileAction', Header: 'Zmiana' },
      { accessor: 'required', Header: 'Zmienić?' },
    ],
    [],
  );

  const rows = React.useMemo(
    () => filesFetch?.data?.files ?? [],
    [filesFetch.data],
  );

  return (
    <>
      {filesFetch?.isLoading && (
        <>
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" />
        </>
      )}
      {filesFetch?.isLoading === false && filesFetch?.data && (
        <FileTable columns={columns} data={rows} />
      )}
    </>
  );
}

function FileTable({ columns, data }) {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const renderCell = (cell: any) => {
    // console.log(cell.column.id);
    if (Object.values(FileActions).includes(cell.value)) {
      return renderFileAction(cell.value);
    }

    if (typeof cell.value === 'boolean') return renderRequired(cell.value);

    return cell.render('Cell');
  };

  const renderRequired = (required = true) => {
    return <Checkbox defaultChecked={true} disabled={required} />;
  };

  const renderFileAction = (
    value: typeof FileActions[keyof typeof FileActions],
  ) => {
    switch (value) {
      case FileActions.DOWNLOAD:
        return <FileDownloadOutlinedIcon color="info" />;
      case FileActions.MODIFY:
        return <MoreHorizOutlinedIcon color="warning" />;
      case FileActions.DELETE:
        return <DeleteForeverOutlinedIcon color="error" />;

      default:
        return <QuestionMarkOutlinedIcon />;
    }
  };

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {renderCell(cell)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default FileTableContainer;
