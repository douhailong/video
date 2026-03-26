'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

type FormValues = {
  comment: string;
};

type CommentFormProps = {
  postId: string;
};

const CommentForm = ({ postId }: CommentFormProps) => {
  const [isWriting, setIsWriting] = useState(false);

  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess() {
      utils.comments.getMany.invalidate({ postId });
      setIsWriting(false);
      reset();
    }
  });

  const { register, handleSubmit, reset } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      comment: ''
    }
  });

  const onSubmit = ({ comment }: FormValues) => {
    const trimmed = comment.trim();

    create.mutate({ postId, text: trimmed });
  };

  return (
    <form className='flex gap-2 border-t px-3 py-2' onSubmit={handleSubmit(onSubmit)}>
      <div className='w-full'>
        {isWriting ? (
          <Textarea
            {...register('comment', {
              validate: (value) => value.trim().length > 0
            })}
            className='h-21 focus-visible:border-input resize-none shadow-none placeholder:text-sm focus-visible:ring-0'
            placeholder='添加评论...'
            autoFocus
          />
        ) : (
          <button
            type='button'
            className='text-muted-foreground h-12 w-full rounded-lg border px-3 text-start text-sm'
            onClick={() => setIsWriting(true)}
          >
            添加评论...
          </button>
        )}
        <div className={cn('mt-2 flex justify-end', !isWriting && 'hidden')}>
          <Button
            type='button'
            variant='ghost'
            onClick={() => {
              setIsWriting(false);
              reset();
            }}
          >
            取消
          </Button>
          <Button type='submit' className='bg-blue-600 active:bg-blue-500'>
            评论
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
