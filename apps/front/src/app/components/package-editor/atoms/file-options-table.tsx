import { useEffect, useMemo } from 'react';
import {
  Column,
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table as ReactTable,
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
  OutlinedInput,
  Box,
  TextField,
} from '@mui/material';
import { EditFleOptions, FileToUploadDto } from '@bella/dto';
import { FileAction } from '@bella/enums';

const columnHelper = createColumnHelper<FileToUploadDto>();

export interface FileOptionsContainerArgs {
  editFile: (savePath: string, options: EditFleOptions) => void;
  files: FileToUploadDto[];
  selectFile: (file: FileToUploadDto) => void;
  stopActions: boolean;
}

function FileOptionsTableContainer({ editFile, files, selectFile, stopActions }: FileOptionsContainerArgs) {
  const renderRequired = (savePath: string, originalValue: boolean) => {
    return (
      <Checkbox
        defaultChecked={originalValue}
        onChange={() =>
          stopActions
            ? undefined
            : editFile(savePath, {
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
            stopActions
              ? undefined
              : editFile(savePath, {
                  fileAction: e.target.value as FileAction,
                })
          }>
          <MenuItem value={FileAction.DOWNLOAD}>Pobierz</MenuItem>
          <MenuItem value={FileAction.MODIFY}>Modyfikuj</MenuItem>
          <MenuItem value={FileAction.DELETE}>Usuń</MenuItem>
        </Select>
      </>
    );
  };

  const renderSelect = (item: FileToUploadDto) => {
    return (
      <Checkbox
        defaultChecked={item.selected}
        value={item.selected}
        onChange={() => (stopActions ? undefined : selectFile(item))}
      />
    );
  };

  const columns: FileOptionsTableArgs['columns'] = useMemo(
    () => [
      columnHelper.accessor('selected', {
        id: 'selected',
        header: 'Wybierz',
        size: 40,
        enableColumnFilter: false,
        cell: (props) => renderSelect(props.row.original),
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Nazwa',
        size: 250,
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor('savePath', {
        id: 'savePath',
        header: 'Lokalizacja',
        enableResizing: true,
        size: 330,
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor('fileAction', {
        id: 'fileAction',
        header: 'Zmiana',
        size: 200,
        enableColumnFilter: false,
        cell: (props) => renderFileAction(props.row.original.savePath, props.getValue() as FileAction),
      }),
      columnHelper.accessor('required', {
        id: 'required',
        header: 'Obowiązkowy?',
        size: 50,
        enableColumnFilter: false,
        cell: (props) => renderRequired(props.row.original.savePath, props.getValue() as boolean),
      }),
    ],
    []
  );

  return (
    <>
      {files.length === 0 ? (
        <>
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" />
        </>
      ) : (
        <FileOptionsTable columns={columns} data={files} {...{ editFile, files, selectFile, stopActions }} />
      )}
    </>
  );
}

function Filter({ column, table }: { column: Column<FileToUploadDto, unknown>; table: ReactTable<FileToUploadDto> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <Box sx={{ display: 'flex' }}>
      <OutlinedInput
        type="number"
        size="small"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
        placeholder={`Min`}
      />
      <OutlinedInput
        type="number"
        size="small"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
        placeholder={`Max`}
      />
    </Box>
  ) : (
    <TextField
      variant="outlined"
      size="small"
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Szukaj...`}
    />
  );
}

interface FileOptionsTableArgs extends FileOptionsContainerArgs {
  columns: Array<ColumnDef<FileToUploadDto>>;
  data: Array<FileToUploadDto>;
}

function FileOptionsTable({ columns, data }: FileOptionsTableArgs) {
  const currentTable = useReactTable({
    enableColumnResizing: true,
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    currentTable.setPageSize(5);
  }, []);

  return (
    <Table>
      <TableHead>
        {currentTable.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableCell
                key={header.id}
                variant="head"
                align={['required', 'filesAction', 'selected'].includes(header.id) ? 'center' : 'left'}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getCanFilter() ? (
                  <div>
                    <Filter column={header.column} table={currentTable} />
                  </div>
                ) : null}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>

      <TableBody>
        {currentTable.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                align={['required', 'filesAction'].includes(cell.column.id) ? 'center' : 'left'}
                padding={cell.column.id === 'required' ? 'checkbox' : 'normal'}
                size={cell.column.id === 'required' ? 'small' : null}>
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
