'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import ScreenContent from '@/components/screen-content';

import PlaylistRenderer from '../components/playlist-renderer';

export const tabs = [
  { name: '播放列表', key: 'total' },
  { name: '公开', key: 'public' },
  { name: '私密', key: 'private' }
] as const;

type TabKey = (typeof tabs)[number]['key'];

const PlaylistsView = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>('total');

  return (
    <ScreenContent className='flex flex-col gap-4'>
      <h1 className='px-4 text-3xl font-bold sm:px-0'>播放列表</h1>
      <div className='flex gap-1.5 px-4 sm:px-0'>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            className='h-7 rounded-md px-2.5 text-xs'
            variant={tab.key === currentTab ? 'default' : 'secondary'}
            onClick={() => setCurrentTab(tab.key)}
          >
            {tab.name}
          </Button>
        ))}
      </div>
      <PlaylistRenderer visible={currentTab === 'total' ? undefined : currentTab} />
    </ScreenContent>
  );
};

export default PlaylistsView;
