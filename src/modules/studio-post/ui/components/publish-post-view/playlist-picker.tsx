'use client';

import { ChevronDown } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import PlaylistModal from '@/modules/playlists/ui/components/playlist-modal';

type PlaylistPickerProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

const PlaylistPicker = ({ value, onChange }: PlaylistPickerProps) => {
  const utils = trpc.useUtils();

  const [data, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (next) => next.nextCursor }
  );

  const playlists = data?.pages.flatMap((page) => page.items) || [];

  const onSuccess = () => {
    utils.playlists.getMany.invalidate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border px-3'>
          <span className='text-muted-foreground text-sm'>
            {value.length
              ? value.length === 1
                ? 'jjjj'
                : `${value.length} 个播放列表`
              : '选择播放列表'}
          </span>
          <ChevronDown className='size-6' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[400px]' align='center' side='top'>
        <DropdownMenuGroup>
          {playlists.map((playlist) => (
            <DropdownMenuCheckboxItem
              key={playlist.id}
              checked={value.includes(playlist.id)}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={(checked) => {
                const val = checked
                  ? [...value, playlist.id]
                  : value.filter((id) => id !== playlist.id);
                onChange(val);
              }}
            >
              {playlist.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <div className='h-[50px]' />
        <div className='bg-background absolute inset-x-0 bottom-0 h-[50px]'>
          <DropdownMenuSeparator className='m-0' />
          <div className='flex h-full items-center justify-between px-2'>
            <PlaylistModal onSuccess={onSuccess}>
              <Button variant='secondary' type='button'>
                新建播放列表
                <ChevronDown />
              </Button>
            </PlaylistModal>
            {/* 利用DropdownMenuItem默认行为关闭Dialog */}
            <DropdownMenuItem asChild>
              <Button className='rounded-full px-4' variant='secondary' type='button'>
                完成
              </Button>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlaylistPicker;
