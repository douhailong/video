'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MoreVertical, Trash2, Pencil, ListVideo } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { formatTimeDistance } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import type { ManyPlaylistTypes } from '../../types';
import PlaylistModal from './playlist-modal';

type PlaylistCardProps = {
  data: ManyPlaylistTypes['items'][number];
};

const PlaylistCard = ({ data }: PlaylistCardProps) => {
  const { name, visibility, updatedAt, id } = data;

  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.playlists.delete.useMutation({
    onSuccess: () => utils.playlists.getMany.invalidate()
  });

  return (
    <Link className='group cursor-pointer' href={`/feed/playlists/${id}`}>
      <Thumbnail />
      <div className='flex'>
        <div className='ml-3 w-full sm:ml-0'>
          <h4 className='text-md font-medium'>{name}</h4>
          <p className='text-muted-foreground text-xs sm:text-sm'>
            {visibility === 'public' ? '公开' : '私密'} &nbsp;·&nbsp;{' '}
            {formatTimeDistance(updatedAt)}
          </p>
        </div>
        <ActionButton
          id={data.id}
          onDelete={() => mutate({ id })}
          isPending={isPending}
        />
      </div>
    </Link>
  );
};

PlaylistCard.Skeleton = () => (
  <div>
    <Skeleton className='mb-2 aspect-video sm:rounded-xl' />
    <div className='flex'>
      <div className='ml-3 w-full sm:ml-0'>
        <Skeleton className='mb-1 h-5 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>
  </div>
);

type ActionButtonProps = {
  onDelete: () => void;
  isPending: boolean;
  id: string;
};

const ActionButton = ({ onDelete, isPending, id }: ActionButtonProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size='icon' variant='ghost' onClick={(e) => e.preventDefault()}>
        <MoreVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' side='bottom' onClick={(e) => e.preventDefault()}>
      <DropdownMenuItem disabled={isPending} onClick={onDelete}>
        <Trash2 />
        删除
      </DropdownMenuItem>
      <PlaylistModal id={id}>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil />
          修改
        </DropdownMenuItem>
      </PlaylistModal>
    </DropdownMenuContent>
  </DropdownMenu>
);

type ThumbnailProps = {};

const Thumbnail = ({}: ThumbnailProps) => (
  <div className='relative mb-2 aspect-video overflow-hidden bg-amber-100 sm:rounded-xl'>
    <Image
      className='duration-150 group-hover:scale-105'
      src='/placeholder.svg'
      alt=''
      fill
    />
    <div className='absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded bg-black/80 px-1 py-0.5'>
      <ListVideo className='size-4 text-white' />
      <span className='text-xs font-medium text-white'> 3个视频</span>
    </div>
  </div>
);

export default PlaylistCard;
