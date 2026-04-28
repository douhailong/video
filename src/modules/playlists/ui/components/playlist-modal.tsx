'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { visibility } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import BoundaryModal from '@/components/boundary-modal';

import { tabs } from '../views/playlists-view';
import { usePlaylistModal } from '@/store/use-playlist-modal';

const formSchema = z.object({
  name: z.string().trim().min(1, '请输入标题'),
  visibility: z.enum(visibility)
});

type FormValues = z.input<typeof formSchema>;

type PlaylistModalProps = {
  children: ReactNode;
  id?: string;
  onSuccess?: () => void;
};

const PlaylistModal = ({ children, id, onSuccess }: PlaylistModalProps) => {
  const { isOpen, onClose, onOpen, initialValues } = usePlaylistModal();

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      visibility: 'public'
    }
  });

  const { data, isLoading } = trpc.playlists.getOne.useQuery(
    { id: id! },
    { enabled: !!id }
  );

  const create = trpc.playlists.create.useMutation({
    onSuccess(data) {
      setIsOpen(false);
      if (onSuccess) {
        return onSuccess();
      }
      router.push(`/feed/playlists/${data.id}`);
    }
  });

  const update = trpc.playlists.update.useMutation({
    onSuccess(data) {
      setIsOpen(false);
      if (onSuccess) {
        return onSuccess();
      }
      utils.playlists.getMany.invalidate();
      router.push(`/feed/playlists/${data.id}`);
    }
  });

  useEffect(() => {
    if (data) {
      form.reset({ name: data.name, visibility: data.visibility });
    }
  }, [data]);

  const onSubmit = (values: FormValues) => {
    id ? update.mutate({ ...values, id }) : create.mutate(values);
  };

  return (
    <BoundaryModal
      title='新建播放列表'
      open={isOpen}
      onOpenChange={setIsOpen}
      showCloseButton={false}
      trigger={children}
      className='w-80'
    >
      <ModalSkeleton isLoading={isLoading} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-3', isLoading && 'hidden')}
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder='填写列表标题' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='visibility'
            render={({ field }) => (
              <FormItem>
                <FormLabel>公开范围</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='选择公开范围' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {tabs.slice(1).map((item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BoundaryModal.Fotter>
            <Button
              type='button'
              variant='secondary'
              disabled={create.isPending || update.isPending}
              onClick={() => setIsOpen(false)}
            >
              取消
            </Button>
            <Button type='submit' disabled={create.isPending || update.isPending}>
              创建
            </Button>
          </BoundaryModal.Fotter>
        </form>
      </Form>
    </BoundaryModal>
  );
};

export default PlaylistModal;

const ModalSkeleton = ({ isLoading }: { isLoading: boolean }) => (
  <div className={cn('hidden flex-col gap-3', isLoading && 'flex')}>
    <div className='space-y-2'>
      <Skeleton className='h-4 w-10' />
      <Skeleton className='h-9 w-full' />
    </div>
    <div className='space-y-2'>
      <Skeleton className='h-4 w-16' />
      <Skeleton className='h-9 w-full' />
    </div>
    <BoundaryModal.Fotter className='justify-end'>
      <Skeleton className='h-9 w-14' />
      <Skeleton className='h-9 w-14' />
    </BoundaryModal.Fotter>
  </div>
);
