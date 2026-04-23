'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RowSelectionState, ColumnDef } from '@tanstack/react-table';
import { Lock, LockOpen } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { formatTime } from '@/lib/utils';
import { DEFAULT_LIMIT } from '@/lib/constants';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ManyStudioPostTypes } from '../../types';
import QueryForm from './query-form';
import BulkActions from './bulk-actions';

function PostsTable() {
  const [queryText, setQueryText] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [rowSelection, setRowSelection] = useState<RowSelectionState | null>(null);

  const [data, query] = trpc.studioPost.getMany.useSuspenseQuery({
    page: pageIndex,
    pageSize: DEFAULT_LIMIT,
    query: queryText || undefined
  });

  const { mutate } = trpc.studioPost.deleteMany.useMutation({
    onSuccess() {
      query.refetch();
      setRowSelection(null);
    }
  });

  const selectedIds = Object.keys(rowSelection ?? {});

  return (
    <div>
      <QueryForm
        onSubmitForm={(queryValue) => {
          setQueryText(queryValue);
          setPageIndex(1);
          setRowSelection(null);
        }}
      />
      <BulkActions
        selectedIds={selectedIds}
        onClose={() => setRowSelection(null)}
        onBatchDelete={() => mutate({ ids: selectedIds })}
      />
      <DataTable
        columns={columns}
        dataSource={data.items}
        enableRowSelection
        getRowId={(row) => row.id}
        onSelectionChange={({ rowSelection }) => setRowSelection(rowSelection)}
        pagination={{
          total: data.total,
          page: pageIndex,
          pageSize: DEFAULT_LIMIT,
          onChange: (nextIndex) => setPageIndex(nextIndex)
        }}
        rowSelection={rowSelection}
      />
    </div>
  );
}

function Loading() {
  return (
    <div>
      <div className='flex h-12 items-center px-6'>
        <Skeleton className='h-5 w-40 rounded-none' />
      </div>
      <div className='border-y'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12 pl-6'>
                <Skeleton className='size-4 rounded-[4px]' />
              </TableHead>
              <TableHead className='w-[420px] pl-4'>Title</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className='pl-6'>
                  <Skeleton className='size-4 rounded-[4px]' />
                </TableCell>
                <TableCell className='pl-4'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-20 w-36 rounded-none' />
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-4 w-[120px] rounded-none' />
                      <Skeleton className='h-3 w-[180px] rounded-none' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20 rounded-none' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16 rounded-none' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24 rounded-none' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12 rounded-none' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12 rounded-none' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12 rounded-none' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between px-6 py-4'>
        <Skeleton className='h-4 w-28 rounded-none' />
        <Skeleton className='h-9 w-56 rounded-none' />
      </div>
    </div>
  );
}

export { PostsTable, Loading };

const columns: ColumnDef<ManyStudioPostTypes['items'][number]>[] = [
  {
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    meta: {
      headerClassName: 'w-12 pl-6',
      cellClassName: 'pl-6'
    },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        aria-label='Select all rows'
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onClick={(event) => event.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        aria-label={`Select ${row.original.title}`}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(event) => event.stopPropagation()}
      />
    )
  },
  {
    accessorKey: 'title',
    meta: {
      headerClassName: 'pl-4',
      cellClassName: 'pl-4'
    },
    header: '视频',
    cell: ({ row }) => {
      const post = row.original;

      return (
        <Link
          href={`/studio/create/${row.original.id}?mediaType=${row.original.type}`}
          className='flex w-[340px] items-center gap-3 py-2'
        >
          <div className='bg-muted text-muted-foreground w-30 flex aspect-video shrink-0 items-center justify-center text-xs'>
            No thumbnail
          </div>
          <div className='space-y-1'>
            <div className='line-clamp-1 text-sm' title={post.title}>
              {post.title}
            </div>
            <div className='text-muted-foreground line-clamp-2 text-xs'>
              {post.description || '-'}
            </div>
          </div>
        </Link>
      );
    }
  },
  {
    accessorKey: 'visibility',
    header: '公开范围',
    cell: ({ row }) => (
      <div className='flex items-center gap-1.5'>
        {row.original.visibility === 'private' ? (
          <Lock className='size-4' />
        ) : (
          <LockOpen className='size-4' />
        )}
        <span className='capitalize'>{row.original.visibility}</span>
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: '日期',
    cell: ({ row }) => formatTime(row.original.createdAt, true)
  },
  {
    accessorKey: 'viewCount',
    header: '观看次数',
    cell: ({ row }) => row.original.viewCount ?? '-'
  },
  {
    id: 'comments',
    header: '评论数',
    cell: () => '-'
  },
  {
    id: 'likes',
    header: '赞和不喜欢比率',
    cell: () => '-'
  }
];
