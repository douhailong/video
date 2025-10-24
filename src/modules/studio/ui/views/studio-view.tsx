import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpFromLine, Radio } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type StudioViewProps = {};

const StudioView = ({}: StudioViewProps) => {
  return (
    <div className='max-w-screen-lg px-7 pb-8 pt-5'>
      <div className='flex items-stretch justify-between'>
        <h1 className='text-2xl font-bold'>频道信息中心</h1>
        <div className=''>
          <div className='flex gap-3'>
            <Button size='icon' variant='outline'>
              <ArrowUpFromLine />
            </Button>
            <Button size='icon' variant='outline'>
              <Radio />
            </Button>
          </div>
        </div>
      </div>
      <div className='mt-6 flex w-2/3 flex-col gap-6 sm:flex-row'>
        <div className='flex-1 rounded-2xl border p-6'>
          <div className='flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed px-6 py-24'>
            <div className='text-muted-foreground text-center text-xs'>
              <div className='relative h-40 w-full'>
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
        <div className='flex flex-1 flex-col gap-4 self-start rounded-2xl border p-6'>
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
            <Button className='w-fit' variant='secondary'>
              前往频道数据分析
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioView;
