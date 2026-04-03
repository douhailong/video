import { Trash2, Pause, Settings, Search } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';

type ActionBarProps = {};

const ActionBar = ({}: ActionBarProps) => {
  // const {} = trpc.playlists.deleteOne.useMutation();

  return (
    <div className='w-md flex flex-col items-start gap-2'>
      <div className='border-primary/70 mx-3.5 mb-4 flex border-b'>
        <Button size='icon' variant='ghost' className='-ml-2.5'>
          <Search />
        </Button>
        <input
          type='text'
          className='outline-none placeholder:text-sm'
          placeholder='搜索观看记录'
        />
      </div>
      <Button variant='ghost'>
        <Trash2 className='size-6' />
        清除所有观看记录
      </Button>
      <Button variant='ghost'>
        <Pause className='size-6' />
        暂停观看记录
      </Button>
      <Button variant='ghost'>
        <Settings className='size-6' />
        管理所有历史记录
      </Button>
    </div>
  );
};

export default ActionBar;
