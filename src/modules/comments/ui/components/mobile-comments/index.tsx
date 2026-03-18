'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import UserAvatar from '@/components/user-avatar';

import CommentForm from './comment-form';
import Comments from './comments';

type MobileCommentsProps = { commentCount: number; postId: string };

const MobileComments = ({ commentCount, postId }: MobileCommentsProps) => {
  return (
    <Drawer>
      <MobileCommentsTrigger commentCount={commentCount} />
      <DrawerContent className='h-[calc(100vh-(56.25vw+48px))]'>
        <DrawerHeader>
          <DrawerTitle className='flex items-center gap-1.5'>
            <p className='text-lg'>评论</p>
            <span className='text-muted-foreground text-sm'>{commentCount}</span>
          </DrawerTitle>
        </DrawerHeader>
        <div className='flex flex-1 flex-col overflow-y-auto'>
          <CommentForm postId={postId} />
          <Comments postId={postId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const MobileCommentsTrigger = ({ commentCount }: { commentCount: number }) => (
  <DrawerTrigger asChild>
    <div className='bg-secondary rounded-lg p-3'>
      <div className='flex gap-0.5'>
        <h2 className='text-sm'>评论</h2>
        <span className='text-muted-foreground text-sm'>{commentCount}</span>
      </div>
      <div className='mt-2 flex items-center gap-3'>
        <UserAvatar className='size-6.5' />
        <div className='text-foreground bg-input h-6.5 flex w-full items-center rounded-full px-3 text-xs'>
          添加评论...
        </div>
      </div>
    </div>
  </DrawerTrigger>
);

export default MobileComments;
