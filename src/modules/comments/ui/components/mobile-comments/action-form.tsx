'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Smile, Image } from 'lucide-react';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type FormValues = {
  comment: string;
};

type ActionFormProps = {
  postId: string;
  parentId?: string;
  feedbackId?: string;
  onSuccess?: () => void;
};

const ActionForm = ({ postId, parentId, feedbackId, onSuccess }: ActionFormProps) => {
  const [isInput, setIsInput] = useState(false);

  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess() {
      utils.comments.getMany.invalidate({ postId });
      setIsInput(false);
      reset();
    }
  });

  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      comment: ''
    }
  });

  const onSubmit = ({ comment }: FormValues) => {
    create.mutate({ postId, text: comment.trim() });
  };

  return (
    <form className='group w-full border-t px-3 py-2' onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register('comment', {
          validate: (value) => value.trim().length > 0
        })}
        className={cn(
          'h-21 focus-visible:border-input hidden resize-none shadow-none placeholder:text-sm focus-visible:ring-0',
          isInput && 'block'
        )}
        placeholder='添加评论...'
        autoFocus
      />
      <button
        type='button'
        className={cn(
          'text-muted-foreground [&_svg]:size-5.5 flex h-10 w-full items-center justify-between rounded-lg border px-3',
          isInput && 'hidden'
        )}
        onClick={() => setIsInput(true)}
      >
        <p className='text-sm'>发条评论，和大家一起讨论</p>
        <div className='flex items-center gap-4'>
          <Image />
          <Smile />
        </div>
      </button>
      <div className={cn('mt-2 hidden items-center justify-between', isInput && 'flex')}>
        <div className='flex items-center gap-4'>
          <Image />
          <Smile />
        </div>
        <Button type='submit' className='bg-blue-600 active:bg-blue-500'>
          评论
        </Button>
      </div>
    </form>
  );
};

export default ActionForm;
