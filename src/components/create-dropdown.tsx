'use client';

import Link from 'next/link';
import { ArrowUpFromLine, Radio } from 'lucide-react';

import { type ButtonProps, Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useDialog } from '@/modules/studio/ui/components/post-form-dialog';

type CreateDropdownProps = {
  icon: ReactNode;
  variant?: ButtonProps['variant'];
};

export default function CreateDropdown({
  icon,
  variant = 'outline'
}: CreateDropdownProps) {
  const onOpen = useDialog();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className='gap-1'>
          {icon}
          创建
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-44' align='end' side='bottom'>
        <DropdownMenuItem onClick={onOpen}>
          <ArrowUpFromLine />
          上传作品
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/studio/live-stream'>
            <Radio />
            开始直播
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
