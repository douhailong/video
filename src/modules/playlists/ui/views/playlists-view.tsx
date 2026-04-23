'use client';

import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SizeConstraint from '@/components/size-constraint';

import PlaylistsBody from '../components/playlists-body';

export const tabs = [
  { name: '播放列表', key: 'total' },
  { name: '公开', key: 'public' },
  { name: '私密', key: 'private' }
] as const;

type TabKey = (typeof tabs)[number]['key'];

const PlaylistsView = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>('total');

  return (
    <SizeConstraint>
      <SizeConstraint.Title title='播放列表' />
      <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as TabKey)}>
        <TabsList variant='button' className='px-4 sm:px-0'>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <PlaylistsBody visibility={currentTab === 'total' ? undefined : currentTab} />
      </Tabs>
    </SizeConstraint>
  );
};

export default PlaylistsView;
