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

function PlaylistsTable() {
  const [queryText, setQueryText] = useState('');
  const [pageIndex, setPageIndex] = useState(1);

  const [data, query] = trpc.posts.studio.getMany.useSuspenseQuery({
    page: pageIndex,
    pageSize: DEFAULT_LIMIT,
    query: queryText || undefined
  });

  const { mutate } = trpc.posts.studio.deleteMany.useMutation({
    onSuccess() {
      query.refetch();
    }
  });

  return (
    <div>
      <QueryForm
        onSubmitForm={(queryValue) => {
          setQueryText(queryValue);
          setPageIndex(1);
        }}
      />

      <DataTable
        columns={columns}
        dataSource={data.items}
        enableRowSelection
        getRowId={(row) => row.id}
        pagination={{
          total: data.total,
          page: pageIndex,
          pageSize: DEFAULT_LIMIT,
          onChange: (nextIndex) => setPageIndex(nextIndex)
        }}
      />
    </div>
  );
}

export { PlaylistsTable };

const columns: ColumnDef<ManyStudioPostTypes['items'][number]>[] = [
  {
    accessorKey: 'title',
    meta: {
      headerClassName: 'pl-4',
      cellClassName: 'pl-4'
    },
    header: '播放列表',
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
    header: '类型',
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
    accessorKey: 'updatedAt',
    header: '上次更新时间',
    cell: ({ row }) => formatTime(row.original.updatedAt, true)
  },
  {
    id: 'comments',
    header: '视频数',
    cell: () => '-'
  },
  {
    accessorKey: 'viewCount',
    header: '观看次数',
    cell: ({ row }) => row.original.viewCount ?? '-'
  }
];
