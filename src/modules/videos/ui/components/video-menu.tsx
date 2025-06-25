import { toast } from 'sonner';
import { ListPlusIcon, MoreVerticalIcon, Share2Icon, Trash2Icon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type VideoMenuProps = {
  videoId: string;
  variant?: 'secondary' | 'ghost';
  onRemove?: () => void;
};

const VideoMenu = ({ videoId, variant = 'ghost' }: VideoMenuProps) => {
  const onShare = async () => {
    const fullUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/videos/${videoId}`;

    await navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size='icon' className='rounded-full'>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={onShare}>
          <Share2Icon className='mr-2 size-4' />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ListPlusIcon className='mr-2 size-4' />
          Add to playlist
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2Icon className='mr-2 size-4' />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoMenu;
