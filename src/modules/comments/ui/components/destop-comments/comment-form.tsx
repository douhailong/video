'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';
import { WritableDiv } from '@/components/writable-div';

type CommentFormProps = {
  postId: string;
  parentId?: string;
  repliedId?: string;
  onSuccess?: () => void;
};

const CommentForm = ({ postId, parentId, repliedId, onSuccess }: CommentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      // TODO 刷新请求导致关闭动画卡顿
      setIsOpen(false);
      utils.comments.getMany.invalidate({ postId });
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const onSubmit = () => {
    create.mutate({ text, parentId, repliedId, postId });
  };

  return (
    <div className='flex gap-3'>
      <UserAvatar className={cn('size-6 duration-150', isOpen && 'size-10')} />
      <div className='flex w-full flex-col gap-2'>
        <div>
          <WritableDiv
            className={cn(
              'focus:border-primary border-b border-transparent duration-300',
              !isOpen && 'border-border'
            )}
            value={text}
            onClick={() => setIsOpen(true)}
            onChange={(val) => setText(val as string)}
          />
          <div
            className={cn(
              'bg-primary mx-auto h-[1px] w-0 border-none duration-300',
              isOpen && 'w-full'
            )}
          />
        </div>
        <div className={cn('hidden items-center justify-between', isOpen && 'flex')}>
          <button>
            <Smile />
          </button>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              onClick={() => {
                setText('');
                setIsOpen(false);
              }}
            >
              取消
            </Button>
            <Button
              className='bg-blue-600 hover:bg-blue-600/90'
              disabled={!text.length || create.isPending}
              onClick={onSubmit}
            >
              评论
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
