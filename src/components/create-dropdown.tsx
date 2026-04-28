'use client';

import Link from 'next/link';
import { ArrowUpFromLine, Radio, ListPlus } from 'lucide-react';

import { type ButtonProps, Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import PlaylistModal from '@/modules/playlists/ui/components/playlist-modal';

type CreateDropdownProps = {
  icon: ReactNode;
  variant?: ButtonProps['variant'];
};

export default function CreateDropdown({
  icon,
  variant = 'outline'
}: CreateDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className='gap-1'>
          {icon}
          创建
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-44' align='end' side='bottom'>
        <DropdownMenuItem asChild>
          <Link href='/studio/create'>
            <ArrowUpFromLine />
            上传作品
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/live-stream'>
            <Radio />
            开始直播
          </Link>
        </DropdownMenuItem>
        <PlaylistModal>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ListPlus />
            新建播放列表
          </DropdownMenuItem>
        </PlaylistModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
