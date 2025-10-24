import { toast } from 'sonner';
import { ListPlus, MoreHorizontal, Share2, ChartColumn, SquarePen } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PostMenuProps = { isSelf: boolean };

const PostMenu = ({ isSelf }: PostMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon'>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>
          <Share2 className='mr-2 size-4' />
          分享
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ListPlus className='mr-2 size-4' />
          稍后观看
        </DropdownMenuItem>
        {isSelf && (
          <DropdownMenuItem>
            <ChartColumn className='mr-2 size-4' />
            数据分析
          </DropdownMenuItem>
        )}
        {/* {isSelf && (
          <DropdownMenuItem asChild className='sm:hidden'>
            <Link href=''>
              <SquarePen className='mr-2 size-4' />
              编辑视频
            </Link>
          </DropdownMenuItem>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;
