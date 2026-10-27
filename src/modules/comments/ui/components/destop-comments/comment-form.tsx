'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Smile } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';
import { WritableDiv } from '@/components/writable-div';

const formSchema = z.object({
  comment: z.string().trim().min(1)
});

type FormValues = z.infer<typeof formSchema>;

type CommentFormProps = {
  postId: string;
  parentId?: string;
  repliedId?: string;
};

export default function CommentForm({ postId, parentId, repliedId }: CommentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      // TODO 刷新请求导致关闭动画阻塞
      setIsOpen(false);
      utils.comments.getMany.invalidate({ postId });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: ''
    }
  });

  const onSubmit = (values: FormValues) => {
    create.mutate({
      postId,
      text: values.comment,
      parentId,
      repliedId
    });
  };

  const comment = form.watch('comment');

  return (
    <div className='flex gap-3'>
      <UserAvatar className={cn('size-6 duration-150', isOpen && 'size-10')} />
      <form className='flex w-full flex-col gap-2' onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <WritableDiv
            className={cn(
              'focus:border-primary border-b border-transparent duration-150',
              !isOpen && 'border-border'
            )}
            // value={text}
            onClick={() => setIsOpen(true)}
            // onChange={(val) => setText(val as string)}
          />
          <div
            className={cn(
              'bg-primary mx-auto h-[1px] w-0 border-none duration-300',
              isOpen && 'w-full'
            )}
          />
        </div>
        <div className={cn('hidden items-center justify-between', isOpen && 'flex')}>
          <button type='button'>
            <Smile />
          </button>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => {
                // setText('');
                setIsOpen(false);
              }}
            >
              取消
            </Button>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-600/90'
              disabled={!comment.length || create.isPending}
            >
              评论
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
