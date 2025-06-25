'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useUser, useClerk } from '@clerk/nextjs';

import { trpc } from '@/trpc/client';
import { commentInsertSchema, comments } from '@/db/schema';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/user-avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

type CommentFormProps = {
  videoId: string;
  onSuccess?: () => void;
};

const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ authorId: true })),
    defaultValues: {
      videoId,
      value: ''
    }
  });

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      toast.success('Comment added');
      onSuccess?.();
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        clerk.openSignIn();
      }
    }
  });

  const onSubmit = (values: z.infer<typeof commentInsertSchema>) => {
    create.mutate(values);
  };

  return (
    <Form {...form}>
      <form className='flex gap-4 group' onSubmit={form.handleSubmit(onSubmit)}>
        <UserAvatar
          size='lg'
          imageUrl={user?.imageUrl || '/user-placeholder.svg'}
          name={user?.username || 'User'}
        />
        <div className='flex-1'>
          <FormField
            name='value'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Add a comment...'
                    className='resize-none overflow-hidden bg-transparent'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2 mt-2'>
            <Button type='submit' disabled={create.isPending}>
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
