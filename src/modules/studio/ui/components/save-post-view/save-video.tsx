'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { type PostSchema, postSchema } from '@/lib/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import RedDot from '@/components/red-dot';
import PosterPicker from './poster-picker';
import { useDraft } from '@/modules/studio/hooks/use-draft';

type SaveVideoProps = { postId?: string };

const SaveVideo = ({ postId }: SaveVideoProps) => {
  const router = useRouter();
  const { draft, setDraft } = useDraft();

  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const create = trpc.studio.posts.create.useMutation();

  const { data } = trpc.studio.posts.getOne.useQuery(
    { id: postId!, type: 'video' },
    { enabled: !!postId }
  );

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      description: '',
      posterUrl: '',
      visible: 'public'
    }
  });

  useEffect(() => {
    // postId ? form.reset() : form.reset();
  }, [data, draft]);

  const onSubmit = (values: PostSchema) => {
    console.log(values, 'vvvvv');
    create.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex justify-between'>
          <h1 className='text-xl font-bold'>详细信息</h1>
          <div className='flex items-center gap-x-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                setDraft(form.getValues());
                router.push('/studio/create');
              }}
            >
              暂存离开
            </Button>
            <Button type='submit'>发布</Button>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
          <div className='space-y-6 lg:col-span-3'>
            <FormField
              control={form.control}
              name='posterUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RedDot>封面</RedDot>
                  </FormLabel>
                  <FormControl>
                    <PosterPicker />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>
                    <RedDot>介绍</RedDot>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      className='h-36 resize-none'
                      placeholder='填写更全面的信息，让更多人看到你的作品吧'
                    />
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
                  <FormLabel>
                    <RedDot>分类</RedDot>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='选择作品分类' />
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
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>合集</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='选择作品分类' />
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
              name='visible'
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
                        <label className='text-muted-foreground text-sm' htmlFor='public'>
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
  );
};

export default SaveVideo;
