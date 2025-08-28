'use client';

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  CopyCheckIcon,
  LockIcon,
  LockOpenIcon,
  CopyIcon,
  IterationCw,
  MoreVertical,
  Trash,
  CirclePause,
  Loader2
} from 'lucide-react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';
import { type PostSchema, postSchema } from '@/lib/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
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
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

type FormSectionProps = {
  className?: string;
  percent: number;
  playbackUrl?: string;
};

const FormSection = ({ className, percent, playbackUrl }: FormSectionProps) => {
  const utils = trpc.useUtils();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      visible: 'public'
    }
  });

  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success('Post created');
    }
  });

  const onSubmit = (values: PostSchema) => {
    createPost.mutate({
      ...values,
      title: values.title ?? '未命名'
    });
  };

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='mb-4 flex items-center justify-between'>
            <h1 className='text-xl font-bold'>视频详情</h1>
            <div className='flex gap-2'>
              <Button type='submit' disabled={createPost.isPending}>
                {createPost.isPending && <Loader2 className='animate-spin' />}
                立即投稿
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon' type='button' variant='ghost'>
                    <MoreVertical className='' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>
                    <Trash className='mr-1.5 size-4' />
                    保存草稿
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash className='mr-1.5 size-4' />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
            <div className='space-y-6 lg:col-span-3'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标题</FormLabel>
                    <FormControl>
                      <Input maxLength={80} {...field} placeholder='请输入稿件标题' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selected a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>简介</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={10}
                        className='h-40 resize-none'
                        placeholder='Add a description to your post'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-y-6 lg:col-span-2'>
              <div className='overflow-hidden rounded-xl bg-[#f9f9f9]'>
                <div
                  className={cn(
                    'aspect-video overflow-hidden',
                    false ? '' : 'flex items-center justify-center bg-black/90'
                  )}
                >
                  <CirclePause className='size-7 text-white/90' />
                </div>
                <div className='flex flex-col gap-y-4 px-4 py-8'>
                  <div className='flex flex-col'>
                    <p className='text-muted-foreground text-xs'>视频链接</p>
                    <div className='flex items-center gap-x-2'>
                      <Link
                        href={`/posts/${1}`}
                        className='line-clamp-1 text-sm text-blue-500'
                      >
                        {playbackUrl ?? 'http://nextjs.com'}
                      </Link>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='shrink-0'
                      >
                        {true ? <CopyCheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-muted-foreground text-xs'>上传进度</p>
                    <div className='flex items-center gap-x-2'>
                      <Progress value={percent} className='h-1' />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='shrink-0'
                      >
                        <IterationCw />
                      </Button>
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-muted-foreground text-xs'>处理状态</p>
                    <div className='flex items-center gap-x-2'>
                      <span className='mt-2 text-sm'>上传中</span>
                    </div>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name='visible'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selected visibility' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='public'>
                          <LockOpenIcon className='mr-2 size-4' />
                          Public
                        </SelectItem>
                        <SelectItem value='private'>
                          <LockIcon className='mr-2 size-4' />
                          Private
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormSection;
