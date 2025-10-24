import Link from 'next/link';
import { ArrowUpFromLine, Radio, ListPlus } from 'lucide-react';

import { type ButtonProps, Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type CreateDropdownProps = {
  icon: React.ReactNode;
  variant?: ButtonProps['variant'];
};

const CreateDropdown = ({ icon, variant = 'outline' }: CreateDropdownProps) => {
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
            <ArrowUpFromLine className='mr-2 size-4' />
            上传作品
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/live-stream'>
            <Radio className='mr-2 size-4' />
            开始直播
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/playlist'>
            <ListPlus className='mr-2 size-4' />
            新建播放列表
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateDropdown;
