'use client';

import { Plus } from 'lucide-react';

// import { trpc } from '@/trpc/server';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { usePlaylistModal } from '@/store/use-playlist-modal';

import { ActionBar, ActionBarContent } from './action-bar';

const YouBody = () => {
  // const data = await trpc.you.getYou();

  const { open, isOpen } = usePlaylistModal();

  return (
    <div className='pt-6'>
      <ActionBar title='历史记录' href='/feed/history'>
        <ActionBarContent>11111</ActionBarContent>
      </ActionBar>
      <ActionBar
        title='播放列表'
        href='/feed/playlists'
        actionButton={
          <Button size='icon' variant='ghost' onClick={() => open()}>
            <Plus />
          </Button>
        }
      />
      <ActionBar title='稍后观看' description='4 个视频' href='/feed/playlists' />
      <ActionBar title='赞过的视频' href='/feed/history' />
    </div>
  );
};

YouBody.Loading = () => (
  <div className='space-y-4 pt-6'>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className='flex items-center justify-between'>
        <Skeleton className='h-8 w-20' />
        <div className='flex gap-2'>
          <Skeleton className='size-9 rounded-md' />
          <Skeleton className='h-9 w-24 rounded-md' />
        </div>
      </div>
    ))}
  </div>
);

export { YouBody };
