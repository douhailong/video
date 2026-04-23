'use client';

import { useState } from 'react';
import {
  type ColumnDef,
  type Row,
  type RowData,
  type RowSelectionState,
  functionalUpdate,
  useReactTable,
  flexRender,
  getCoreRowModel
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow
} from '@/components/ui/table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void | Promise<void>;
  totalText?: ReactNode;
};

type DataTableSelectionChange = {
  rowSelection: RowSelectionState;
  rowSelectionIds: string[];
};

type DataTableProps<TData extends RowData = RowData> = {
  columns: ColumnDef<TData>[];
  dataSource: TData[];
  empty?: ReactNode;
  enableRowSelection?: boolean;
  getRowId?: (originalRow: TData, index: number) => string;
  getRowClassName?: (row: Row<TData>) => string | undefined;
  onRowClick?: (row: Row<TData>) => void;
  onSelectionChange?: (selection: DataTableSelectionChange) => void;
  rowSelection?: RowSelectionState | null;
  pagination?: PaginationProps;
};

function DataTable<TData extends RowData = RowData>({
  columns,
  dataSource,
  empty = 'No results.',
  enableRowSelection = false,
  getRowId,
  getRowClassName,
  onRowClick,
  onSelectionChange,
  pagination,
  rowSelection
}: DataTableProps<TData>) {
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
  const resolvedRowSelection = rowSelection ?? internalRowSelection;

  const table = useReactTable({
    data: dataSource,
    columns,
    state: {
      rowSelection: resolvedRowSelection
    },
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    onRowSelectionChange: (updaterOrValue) => {
      const nextRowSelection = functionalUpdate(updaterOrValue, resolvedRowSelection);

      if (rowSelection === undefined) {
        setInternalRowSelection(nextRowSelection);
      }

      onSelectionChange?.({
        rowSelection: nextRowSelection,
        rowSelectionIds: Object.keys(nextRowSelection)
      });
    }
  });

  return (
    <div className=''>
      <Table className='border-y'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.headerClassName}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className={cn(onRowClick && 'cursor-pointer', getRowClassName?.(row))}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.cellClassName}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='text-muted-foreground h-24 text-center'
              >
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {/* <TableFooter></TableFooter> */}
      </Table>
      <TablePagination pagination={pagination} />
    </div>
  );
}

export { DataTable };
export type { DataTableProps, DataTableSelectionChange };

type TablePaginationProps = { pagination?: PaginationProps };

function TablePagination({ pagination }: TablePaginationProps) {
  if (!pagination) {
    return null;
  }

  function getPageItems(currentPage: number, totalPages: number) {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 'ellipsis', totalPages] as const;
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        'ellipsis',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ] as const;
    }

    return [
      1,
      'ellipsis',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis',
      totalPages
    ] as const;
  }

  const pageCount = pagination
    ? Math.max(Math.ceil(pagination.total / pagination.pageSize), 1)
    : 1;

  const paginationItems = pagination ? getPageItems(pagination.page, pageCount) : [];

  return (
    <div className='flex flex-col items-end gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-muted-foreground text-sm'>
        {pagination.totalText ?? `共 ${pagination.total} 条`}
      </div>
      <Pagination className='mx-0 w-auto justify-start sm:justify-end'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              className={cn(pagination.page === 1 && 'pointer-events-none opacity-50')}
              onClick={(event) => {
                event.preventDefault();
                void pagination.onChange(pagination.page - 1);
              }}
            />
          </PaginationItem>
          {paginationItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href='#'
                  isActive={item === pagination.page}
                  onClick={(event) => {
                    event.preventDefault();
                    void pagination.onChange(item);
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href='#'
              // className={cn(
              //   pagination.page >= pageCount && 'pointer-events-none opacity-50'
              // )}
              onClick={(event) => {
                event.preventDefault();
                void pagination.onChange(pagination.page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
