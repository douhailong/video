import Link from 'next/link';
import { Bell, MoreVertical, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

type MessageButtonProps = {};

const MessageButton = async ({}: MessageButtonProps) => {
  const num = '9+';
  // TODO 请求studio消息

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToggleButton num={num} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[480px]' align='end' side='top'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span className='text-base'>通知</span>
          <Settings className='size-6' />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <MenuItem />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageButton;

const MenuItem = () => {
  return (
    <div className='py-4 pr-4'>
      <Link href='' className='flex w-full gap-2'>
        <div className='size-12 rounded-full bg-red-200'>1</div>
        <div>
          <p className='pb-2'>为你推荐：Jan Marshal</p>
          <span className='text-muted-foreground text-xs'>一天前</span>
        </div>
        <div className='aspect-video h-12 rounded-md bg-red-100'></div>
      </Link>
      <Button variant='ghost' size='icon'>
        <MoreVertical />
      </Button>
    </div>
  );
};

const ToggleButton = ({ num }: { num: string }) => {
  return (
    <Button variant='ghost' className='relative size-10'>
      <Bell className='size-6' />
      <div
        className={cn(
          'absolute -right-1 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-red-600 opacity-0 ring-1 ring-white transition-opacity',
          !!1 && 'opacity-100'
        )}
      >
        <span className='px-1 text-xs text-white'>{num}</span>
      </div>
    </Button>
  );
};
