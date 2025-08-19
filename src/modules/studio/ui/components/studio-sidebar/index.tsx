'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Video, Upload, FileVideo } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

import StudioSidebarHeader from './studio-sidebar-header';

const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className='border-nones z-40 pt-16' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton tooltip='投稿' asChild isActive={pathname === '/studio/create'}>
                <Link href='/studio/create'>
                  <FileVideo className='size-5' />
                  <span className='text-sm'>投稿</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip='作品管理' asChild isActive={pathname === '/studio'}>
                <Link href='/studio'>
                  <Video className='size-5' />
                  <span className='text-sm'>作品管理</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator />
            <SidebarMenuItem>
              <SidebarMenuButton tooltip='返回主页' asChild>
                <Link href='/'>
                  <LogOut className='size-5' />
                  <span className='text-sm'>返回主页</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudioSidebar;
