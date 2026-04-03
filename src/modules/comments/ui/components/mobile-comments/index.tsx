import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import Boundary from '@/components/boundary';
import UserAvatar from '@/components/user-avatar';

import ActionForm from './action-form';
import Comments from './comments';

type MobileCommentsProps = { commentCount?: number; postId: string };

const MobileComments = ({ commentCount = 1001, postId }: MobileCommentsProps) => {
  return (
    <div className='m-4 mt-2 block sm:hidden'>
      <Drawer>
        <DrawerTrigger asChild>
          <div className='bg-secondary rounded-lg px-3 py-2'>
            <div className='flex gap-0.5'>
              <h4 className='text-sm'>评论</h4>
              <span className='text-muted-foreground text-sm'>{commentCount}</span>
            </div>
            <div className='mt-2 flex items-center gap-3'>
              <UserAvatar className='size-7' />
              <div className='text-foreground bg-input flex h-7 w-full items-center rounded-full px-3 text-xs'>
                添加评论...
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className='h-[calc(100vh-(56.25vw+48px))]'>
          <DrawerHeader>
            <DrawerTitle className='flex items-center gap-1.5'>
              <p className='text-lg'>评论</p>
              <span className='text-muted-foreground text-sm'>{commentCount}</span>
            </DrawerTitle>
          </DrawerHeader>
          <div className='flex-1 overflow-y-auto'>
            <Boundary fallback={<div>Loading...</div>}>
              <Comments postId={postId} />
            </Boundary>
          </div>
          <DrawerFooter className='p-0'>
            <ActionForm postId={postId} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileComments;
