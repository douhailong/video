import { Trash2, Pause, Settings, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

import HistoryRenderer from '../components/history-renderer';

type HistoryViewProps = {};

const HistoryView = ({}: HistoryViewProps) => {
  return (
    <div className='mx-auto max-w-screen-lg p-6'>
      <h1 className='text-3xl font-bold'>观看历史</h1>
      <div className='flex flex-col-reverse gap-4 lg:flex-row'>
        <div className=' w-full bg-red-300'>
          <HistoryRenderer />
          <HistoryRenderer />
          <HistoryRenderer />
          <HistoryRenderer />
        </div>
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
      </div>
    </div>
  );
};

export default HistoryView;
