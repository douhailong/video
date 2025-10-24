'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { type PostSchema, postSchema } from '@/lib/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

type WorkFormProps = { workId: string };

const WorkForm = ({ workId }: WorkFormProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  // const [work] = trpc.studio.works.getOne.useSuspenseQuery({ id: workId });
  // const update = trpc.studio.works.update.useMutation();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {}
  });

  const onSubmit = (values: PostSchema) => {
    // update.mutate(values);
    console.log(values, 'vvvvv');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='mb-4 flex justify-between'>
          <h1 className='text-xl font-bold'>详细信息</h1>
          <div className='flex items-center gap-x-2'>
            <Button type='button' variant='secondary'>
              保存草稿
            </Button>
            <Button type='submit'>发布</Button>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
          <div className='space-y-6 lg:col-span-3'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题（必填）</FormLabel>
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
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设置封面</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='添加一个可以描述视频的标题' />
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
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>添加合集</FormLabel>
                  <FormControl>
                    <RadioGroup defaultValue='comfortable' className='flex gap-3'>
                      <div className='flex items-center gap-2.5'>
                        <RadioGroupItem value='default' id='r1' />
                        <label className='text-muted-foreground text-sm' htmlFor='r1'>
                          公开
                        </label>
                      </div>
                      <div className='flex items-center gap-2.5'>
                        <RadioGroupItem value='comfortable' id='r2' />
                        <label className='text-muted-foreground text-sm' htmlFor='r2'>
                          好友可见
                        </label>
                      </div>
                      <div className='flex items-center gap-2.5'>
                        <RadioGroupItem value='compact' id='r3' />
                        <label className='text-muted-foreground text-sm' htmlFor='r3'>
                          尽自己可见
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col gap-y-8 lg:col-span-2'>
            <div className='bg-muted overflow-hidden rounded-xl'>
              <div className='relative aspect-video overflow-hidden bg-black'></div>
              <div className='flex flex-col gap-4 p-4'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex flex-col gap-0.5'>
                    <p className='text-muted-foreground text-xs'>视频链接</p>
                    <Link
                      href={`/videos/${0}`}
                      className='line-clamp-1 text-sm text-blue-500'
                    >
                      {'http://localhost:3000/studio/works'}
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
          </div>
        </div>
      </form>
    </Form>
  );
};

export default WorkForm;
