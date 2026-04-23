'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { type UpdatePostSchema, updatePostSchema } from '@/lib/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import RedDot from '@/components/red-dot';
import SizeConstraint from '@/components/size-constraint';

import ThumbnailPicker from './thumbnail-picker';
import PlaylistPicker from './playlist-picker';

type VideoPostProps = { postId: string };

const VideoPost = ({ postId }: VideoPostProps) => {
  const router = useRouter();

  const [post] = trpc.studioPost.getOne.useSuspenseQuery({ id: postId });

  const { mutate } = trpc.studioPost.update.useMutation({
    onSuccess: () => {
      toast.success('保存成功');
      router.push('/studio/posts');
    }
  });

  const form = useForm({
    resolver: zodResolver(updatePostSchema),
    defaultValues: { id: postId, title: '' }
  });

  useEffect(() => {
    if (post) {
      const { title, description, playlistIds, visibility } = post;
      form.setValue('title', title);
      form.setValue('description', description);
      form.setValue('playlistIds', playlistIds);
      form.setValue('visibility', visibility);
    }
  }, [post]);

  const onSubmit = (values: UpdatePostSchema) => {
    mutate({ ...values, isPublished: true });
  };

  const onTemporary = () => {
    const values = form.getValues();
    mutate({ ...values, isPublished: false });
  };

  return (
    <SizeConstraint size='md'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex justify-between'>
            <SizeConstraint.Title size='md' title='详细信息' />
            <div className='flex items-center gap-x-2'>
              <Button type='button' variant='secondary' onClick={onTemporary}>
                暂存离开
              </Button>
              <Button type='submit'>发布</Button>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 pt-4 lg:grid-cols-5'>
            <div className='space-y-6 lg:col-span-3'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RedDot>标题</RedDot>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='添加作品标题' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>介绍</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        rows={10}
                        className='h-36 resize-none'
                        placeholder='填写更全面的信息，让更多人看到你的作品吧'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name='posterUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      缩略图
                      <p className='text-muted-foreground text-[13px]'>
                        设置与众不同的缩略图，吸引观看者注意。
                      </p>
                    </FormLabel>
                    <FormControl>
                      <ThumbnailPicker />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name='playlistIds'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      播放列表
                      <p className='text-muted-foreground text-[13px]'>
                        将视频整理到一个或多个播放列表中，方便观看者浏览。
                      </p>
                    </FormLabel>
                    <FormControl>
                      <div className='w-1/2'>
                        <PlaylistPicker {...field} value={field.value || []} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-y-6 lg:col-span-2'>
              <div className='bg-muted overflow-hidden rounded-xl'>
                <div className='relative aspect-video overflow-hidden bg-black'></div>
                <div className='flex flex-col gap-4 p-4'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='flex flex-1 flex-col gap-0.5'>
                      <p className='text-muted-foreground text-xs'>视频链接</p>
                      <Link
                        href={`/videos/${0}`}
                        className='line-clamp-1 text-sm text-blue-500'
                      >
                        {'http://localhost:3000/studio/studio'}
                      </Link>
                    </div>
                    <Button type='button' variant='ghost' size='icon'>
                      {true ? <CopyCheckIcon /> : <CopyIcon />}
                    </Button>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <p className='text-muted-foreground text-xs'>文件名</p>
                    <p className='text-foreground text-sm'>文件名.mp4</p>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name='visibility'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RedDot>可见范围</RedDot>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        {...field}
                        onValueChange={field.onChange}
                        className='flex gap-3'
                      >
                        <div className='flex items-center gap-2.5'>
                          <RadioGroupItem value='public' id='public' />
                          <label
                            className='text-muted-foreground text-sm'
                            htmlFor='public'
                          >
                            公开
                          </label>
                        </div>
                        <div className='flex items-center gap-2.5'>
                          <RadioGroupItem value='private' id='private' />
                          <label
                            className='text-muted-foreground text-sm'
                            htmlFor='private'
                          >
                            仅自己
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </SizeConstraint>
  );
};

export default VideoPost;
