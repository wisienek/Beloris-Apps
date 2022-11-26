import { useContext } from 'react';

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Checkbox,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { EditFleOptions, FileUploadDto } from '@bella/dto';
import { FileAction } from '@bella/enums';

import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../sections/package-editor-state';

// const columns: FileOptionsTableArgs['columns'] = [
//   { accessor: 'name', id: 'name', Header: 'Nazwa', width: '30%' },
//   { accessor: 'savePath', id: 'savePath', Header: 'Lokacja', width: '40%' },
//   { accessor: 'fileAction', id: 'fileAction', Header: 'Zmiana', width: '20%' },
//   {
//     accessor: 'required',
//     id: 'required',
//     Header: 'Obowiązkowy?',
//     width: '10%',
//   },
// ];

const columnHelper = createColumnHelper<FileUploadDto>();

export interface FileOptionsContainerArgs {
  editFile: (savePath: string, options: EditFleOptions) => void;
}

function FileOptionsTableContainer(args: FileOptionsContainerArgs) {
  const { files } = useContext<PackageEditorStateValue>(
    PackageEditorStateContext,
  );

  const renderRequired = (savePath: string, originalValue: boolean) => {
    return (
      <Checkbox
        defaultChecked={originalValue}
        onChange={() =>
          args.editFile(savePath, {
            required: !originalValue,
          })
        }
      />
    );
  };

  const renderFileAction = (savePath: string, originalAction: FileAction) => {
    const selectId = `file-action-select-${savePath}`;

    return (
      <>
        <Select
          id={selectId}
          value={originalAction}
          label="Akcja pliku"
          onChange={(e) =>
            args.editFile(savePath, {
              fileAction: e.target.value as FileAction,
            })
          }
        >
          <MenuItem value={FileAction.DOWNLOAD}>Pobierz</MenuItem>
          <MenuItem value={FileAction.MODIFY}>Modyfikuj</MenuItem>
          <MenuItem value={FileAction.DELETE}>Usuń</MenuItem>
        </Select>
      </>
    );
  };

  const columns: FileOptionsTableArgs['columns'] = [
    columnHelper.accessor('name', {
      id: 'name',
      header: 'Nazwa',
      size: 250,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor('savePath', {
      id: 'savePath',
      header: 'Lokalizacja',
      size: 330,
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor('fileAction', {
      id: 'fileAction',
      header: 'Zmiana',
      size: 200,
      cell: (props) =>
        renderFileAction(
          props.row.original.savePath,
          props.getValue() as FileAction,
        ),
    }),
    columnHelper.accessor('required', {
      id: 'required',
      header: 'Obowiązkowy?',
      size: 150,
      cell: (props) =>
        renderRequired(
          props.row.original.savePath,
          props.getValue() as boolean,
        ),
    }),
  ];

  return (
    <>
      {!files || files?.length === 0 ? (
        <>
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" />
        </>
      ) : (
        <FileOptionsTable
          columns={columns}
          data={files as FileUploadDto[]}
          editFile={args.editFile}
        />
      )}
    </>
  );
}

interface FileOptionsTableArgs extends FileOptionsContainerArgs {
  columns: Array<ColumnDef<FileUploadDto>>;
  data: Array<FileUploadDto>;
}

function FileOptionsTable({ columns, data }: FileOptionsTableArgs) {
  const currentTable = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHead>
        {currentTable.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>

      <TableBody>
        {currentTable.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default FileOptionsTableContainer;
