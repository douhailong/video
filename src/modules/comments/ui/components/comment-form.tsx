'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SmileIcon, ImageIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';

type CommentFormProps = {
  postId: string;
  onSuccess?: () => void;
};

type FormValues = {
  content: string;
  postId: string;
};

const CommentForm = ({ postId, onSuccess }: CommentFormProps) => {
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      content: '',
      postId
    }
  });

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ postId });
      toast.success('Comment added');
      reset();
      onSuccess?.();
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  const onSubmit = (values: FormValues) => {
    create.mutate(values);
  };

  return (
    <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
      <div className='group relative w-full cursor-text rounded-md bg-gray-100 p-2.5 focus-within:bg-transparent focus-within:ring-1 focus-within:ring-inset focus-within:ring-blue-500'>
        <textarea
          {...register('content', {
            validate: (value) => value.trim().length > 0
          })}
          placeholder='添加评论内容'
          className='group-focus:min-h-30 min-h-10 w-full bg-transparent outline-none transition-all duration-300'
        />
        <div className='flex items-center justify-between'>
          <div className='flex gap-5'>
            <SmileIcon className='size-5.5 cursor-pointer text-gray-500' />
            <ImageIcon className='size-5.5 cursor-pointer text-gray-500' />
          </div>
          <Button type='submit' disabled={create.isPending}>
            发送
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
