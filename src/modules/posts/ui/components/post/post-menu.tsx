import { toast } from 'sonner';
import { ListPlusIcon, MoreHorizontalIcon, Share2Icon, Trash2Icon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type PostMenuProps = {};

const PostMenu = ({}: PostMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>
          <Share2Icon className='mr-2 size-4' />
          分享
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ListPlusIcon className='mr-2 size-4' />
          稍后观看
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2Icon className='mr-2 size-4' />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;
