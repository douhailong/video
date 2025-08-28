'use client';

import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  CopyCheckIcon,
  CopyIcon,
  LockIcon,
  MoreVertical,
  Trash,
  LockOpenIcon,
  MoreVerticalIcon,
  ImagePlusIcon,
  SparklesIcon,
  RotateCcwIcon
} from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import VideoPlayer from '@/modules/posts/ui/components/videos/video-player';
import { Skeleton } from '@/components/ui/skeleton';
import Error from '@/components/error';
import { createInsertSchema } from 'drizzle-zod';
import { videos } from '@/db/schema';

type FormSectionProps = { videoId: string };

const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<FormSectionSkeleton />}>
        <FormSectionSuspense videoId={videoId} />
      </Suspense>
    </ErrorBoundary>
  );
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const utils = trpc.useUtils();

  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success('Video updated');
    },
    onError: () => {
      toast.error('Something went wrong');
    }
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success('Video removed');
      router.push('/studio');
    },
    onError: () => {
      toast.error('Something went wrong');
    }
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success('Thumbnail restored');
    },
    onError: () => {
      toast.error('Something went wrong');
    }
  });

  const form = useForm({
    resolver: zodResolver(createInsertSchema(videos)),
    defaultValues: video
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/videos/${videoId}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Vodeo details</h1>
            <p className='text-muted-foreground text-xs'>Manage your video details</p>
          </div>
          <div className='flex items-center gap-x-2'>
            <Button type='submit' disabled={update.isPending}>
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => remove.mutate({ id: videoId })}>
                  <Trash className='mr-1.5 size-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
          <div className='space-y-8 lg:col-span-3'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Add a title to your video' />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      rows={10}
                      className='h-40 resize-none'
                      placeholder='Add a description to your video'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='thumbnailUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div className='group relative aspect-video h-[84px] border border-dashed border-neutral-400 p-0.5'>
                      <Image
                        fill
                        src={video.thumbnailUrl || '/placeholder.svg'}
                        alt='thumbnail'
                        className='object-cover'
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type='button'
                            size='icon'
                            className='absolute right-1 top-1 size-6 rounded-full bg-black/50 opacity-100 duration-300 hover:bg-black/50 group-hover:opacity-100 md:opacity-0'
                          >
                            <MoreVerticalIcon className='text-white' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' side='right'>
                          <DropdownMenuItem onClick={() => setIsOpen(true)}>
                            <ImagePlusIcon className='mr-1 size-4' />
                            Change
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <SparklesIcon className='mr-1 size-4' />
                            AI generated
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => restoreThumbnail.mutate({ id: videoId })}
                          >
                            <RotateCcwIcon className='mr-1 size-4' />
                            Restore
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                  <FormLabel>Category</FormLabel>
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
          </div>
          <div className='flex flex-col gap-y-8 lg:col-span-2'>
            <div className='flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#f9f9f9]'>
              <div className='relative aspect-video overflow-hidden bg-black'>
                {/* <VideoPlayer playbackId={video.muxPlaybackId} thumbnailUrl={video.thumbnailUrl} /> */}
              </div>
              <div className='flex flex-col gap-y-6 p-4'>
                <div className='flex items-center justify-between gap-x-2'>
                  <div className='flex flex-col gap-y-1'>
                    <p className='text-muted-foreground text-xs'>Video link</p>
                    <div className='flex items-center gap-x-2'>
                      <Link href={`/videos/${videoId}`}>
                        <p className='line-clamp-1 text-sm text-blue-500'>{fullUrl}</p>
                      </Link>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='shrink-0'
                        onClick={onCopy}
                        disabled={isCopied}
                      >
                        {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-y-1'>
                    <p className='text-muted-foreground text-xs'>Video status</p>
                    <p className='text-sm'>
                      muxStatus{/* {titleToSnakeCase(video.muxStatus)} */}
                    </p>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-y-1'>
                    <p className='text-muted-foreground text-xs'>Subtitles status</p>
                    <p className='text-sm'>
                      muxTrackStatus
                      {/* {titleToSnakeCase(video.muxTrackStatus || 'no_subtitles')} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name='visibility'
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
  );
};

const FormSectionSkeleton = () => {
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-4 w-40' />
        </div>
        <Skeleton className='h-9 w-24' />
      </div>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
        <div className='space-y-8 lg:col-span-3'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-[160px] w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-[84px] w-[153px]' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
        <div className='flex flex-col gap-y-8 lg:col-span-2'>
          <div className='flex flex-col gap-4 overflow-hidden rounded-xl bg-[#f9f9f9]'>
            <Skeleton className='aspect-video' />
            <div className='space-y-6 p-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-5 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-32' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-32' />
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSection;
