'use client';

import { Play, Shuffle } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import SizeConstraint from '@/components/size-constraint';
import { formatTimeDistance } from '@/lib/utils';

type PlaylistViewProps = { id: string };

const PlaylistView = ({ id }: PlaylistViewProps) => {
  const [data] = trpc.playlists.getOne.useSuspenseQuery({ id });

  return (
    <SizeConstraint>
      <div className='fixed bottom-6 left-[74px] top-[calc(24px+56px)] ml-6 w-[360px] rounded-xl bg-black/60 p-6'>
        <div className='aspect-video rounded-xl bg-gray-200'></div>
        <h3 className='text-2xl font-bold text-white'>{data.name}</h3>
        <p className='text-muted text-xs'>
          4 个视频 {formatTimeDistance(data.updatedAt)}
        </p>
        <div className='flex gap-2'>
          <Button className='flex-1' variant='secondary'>
            <Play className='size-5' />
            全部播放
          </Button>
          <Button className='flex-1'>
            <Shuffle className='size-5' />
            随机播放
          </Button>
        </div>
      </div>
      <div className='ml-[384px] h-[1200px] bg-yellow-200'>222</div>
    </SizeConstraint>
  );
};

export default PlaylistView;
