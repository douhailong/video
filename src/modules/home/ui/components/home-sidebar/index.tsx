'use client';

import { usePathname } from 'next/navigation';
import {
  Sparkles,
  PartyPopper,
  AlarmClock,
  User2,
  Users2,
  UserCheck2,
  Wand2,
  Videotape
} from 'lucide-react';

import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

import MenuSection from './menu-section';

const mainMenu = [
  {
    title: '精选',
    url: '/',
    icon: PartyPopper,
    auth: true
  },
  {
    title: '推荐',
    url: '/recommend',
    icon: Sparkles,
    auth: true
  },
  {
    title: '稍后观看',
    url: '/playlist/liked',
    icon: AlarmClock,
    auth: true
  }
];

const personalMenu = [
  {
    title: '关注',
    url: '/subscribe',
    icon: UserCheck2,
    auth: true
  },
  {
    title: '朋友',
    url: '/friend',
    icon: Users2,
    auth: true
  },
  {
    title: '我的',
    url: '/self',
    icon: User2,
    auth: true
  }
];

const extraMenu = [
  {
    title: '直播',
    url: '/live',
    icon: Wand2
  },
  {
    title: '放映厅',
    url: '/film',
    icon: Videotape
  }
];

const HomeSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className='z-40 border-none pt-16' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <MenuSection pathname={pathname} menu={mainMenu} />
        <Separator />
        <MenuSection pathname={pathname} menu={personalMenu} />
        <Separator />
        <MenuSection pathname={pathname} menu={extraMenu} />
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
