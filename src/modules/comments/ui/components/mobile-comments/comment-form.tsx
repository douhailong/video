'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Smile } from 'lucide-react';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  comment: z.string().trim().min(1)
});

type FormValues = z.infer<typeof formSchema>;

type CommentFormProps = {
  isOpen: boolean;
  postId: string;
  parentId: string | null;
  repliedId: string | null;
  onSuccess: () => void;
  onOpenChange: (isOpen: boolean) => void;
};

const CommentForm = ({
  isOpen,
  onOpenChange,
  postId,
  parentId,
  repliedId,
  onSuccess
}: CommentFormProps) => {
  const create = trpc.comments.create.useMutation({
    onSuccess() {
      onOpenChange(false);
      reset();
      onSuccess();
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm<FormValues>({
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

  return (
    <>
      {/*  Drawer打开后遮挡Form后的节点，阻止重新触发item点击事件  */}
      <div className={cn('fixed inset-x-0 top-0 h-0', isOpen && 'h-full')} />
      <form
        className='bg-background group z-10 w-full border-t px-3 py-2 transition-[padding-bottom] duration-150'
        onSubmit={handleSubmit(onSubmit)}
      >
        {isOpen && (
          <Textarea
            autoFocus
            className='focus-visible:border-input bg-secondary/80 block min-h-[80px] w-full resize-none rounded-2xl border-none px-3 shadow-none placeholder:text-sm focus-visible:ring-0'
            placeholder='添加评论...'
            {...register('comment', {
              validate: (value) => value.trim().length > 0,
              onBlur: () => onOpenChange(false)
            })}
          />
        )}
        <button
          type='button'
          className={cn(
            'text-muted-foreground [&_svg]:size-5.5 bg-secondary/80 flex h-10 w-full items-center justify-between rounded-xl border-none px-3',
            isOpen && 'hidden'
          )}
          onClick={() => onOpenChange(true)}
        >
          <p className='text-sm'>添加评论...</p>
          <Smile className='opacity-60' />
        </button>
        <div
          className={cn('mt-2 hidden items-center justify-between', isOpen && 'flex')}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button>
            <Smile className='text-muted-foreground size-5.5 active:opacity-70' />
          </button>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type='submit'
              size='sm'
              className='bg-blue-600 active:bg-blue-700 disabled:opacity-50'
              disabled={!isValid || create.isPending}
            >
              {create.isPending ? '发送中...' : '评论'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CommentForm;
