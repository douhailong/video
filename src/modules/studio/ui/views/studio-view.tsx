import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpFromLine, Radio } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SizeConstraint from '@/components/size-constraint';

const StudioView = () => {
  return (
    <SizeConstraint direction='left'>
      <SizeConstraint.Title title='频道信息中心' size='md' />
      {/* <div className='flex items-stretch justify-between'>
        <div className='flex gap-3'>
          <Button size='icon' variant='outline'>
            <ArrowUpFromLine />
          </Button>
          <Button size='icon' variant='outline'>
            <Radio />
          </Button>
        </div>
      </div> */}
      <div className='flex w-2/3 flex-col gap-6 px-6 pb-8 sm:flex-row'>
        <div className='flex-1 rounded-2xl border p-6'>
          <div className='flex h-full flex-col items-center justify-center gap-6 rounded-2xl border border-dashed'>
            <div className='text-muted-foreground text-center text-xs'>
              <div className='relative h-36 w-full'>
                <Image className='object-contain' src='/empty.svg' alt='empty' fill />
              </div>
              <p>想查看你近期视频的指标？</p>
              <p>上传并发布一个视频，即可开始体验。</p>
            </div>
            <Button asChild>
              <Link href='/studio/create'>上传视频</Link>
            </Button>
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-4 rounded-2xl border p-6'>
          <div className='flex flex-col'>
            <h3 className='text-lg font-medium'>频道分析</h3>
            <span className='mt-2 text-sm'>当前订阅人数</span>
            <span className='mb-5 text-3xl font-bold'>110</span>
          </div>
          <Separator />
          <div className='flex flex-col gap-3'>
            <div>
              <h3 className='text-sm font-medium'>摘要</h3>
              <p className='text-muted-foreground text-xs'>过去28天</p>
            </div>
            <div className='text-foreground flex items-center justify-between text-xs'>
              <span>观看次数</span>
              <span>3 —</span>
            </div>
            <div className='text-foreground flex items-center justify-between text-xs'>
              <span>观看时长（小时）</span>
              <span>3.0 —</span>
            </div>
          </div>
          <Separator />
          <div className='flex flex-col'>
            <h3 className='text-sm font-medium'>热门视频</h3>
            <p className='text-muted-foreground mb-7 text-xs'>过去 48 小时 · 观看次数</p>
            <Link
              href='/studio/analytics'
              className={cn('w-fit', buttonVariants({ variant: 'secondary' }))}
            >
              前往频道数据分析
            </Link>
          </div>
        </div>
      </div>
    </SizeConstraint>
  );
};

export default StudioView;
