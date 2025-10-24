'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, ChartColumn, Captions, FolderCog } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user-avatar';

const menus = [
  { href: '/studio', text: '信息中心', icon: LayoutDashboard },
  { href: '/studio/posts', text: '内容管理', icon: FolderCog },
  { href: '/studio/overview', text: '数据分析', icon: ChartColumn },
  { href: '/studio/captions', text: '字幕', icon: Captions }
];

const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className='border-nones z-40 pt-16' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            {menus.map(({ href, text, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  size='lg'
                  tooltip={text}
                  asChild
                  isActive={pathname === href}
                >
                  <Link href={href}>
                    <Icon />
                    <span className='pl-2 text-base'>{text}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <Separator />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudioSidebar;

const StudioSidebarHeader = () => {
  const { state } = useSidebar();
  const { data } = useSession();
  const user = data?.user;

  if (!user) {
    return (
      <SidebarHeader className='flex items-center justify-center pt-4'>
        <Skeleton className='size-[112px] rounded-full' />
        <div className='mt-2 flex flex-col items-center justify-center gap-y-2'>
          <Skeleton className='h-4 w-[80px]' />
          <Skeleton className='h-4 w-[100px]' />
        </div>
      </SidebarHeader>
    );
  }

  if (state === 'collapsed') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip='个人信息' asChild>
          <Link href='/user/current'>
            <UserAvatar imageUrl={user.image} name={user.name} size='xs' />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className='flex items-center justify-center pt-4'>
      <Link href='/user/current'>
        <UserAvatar
          imageUrl={user.image}
          name={user.name}
          className='size-[112px] transition-opacity hover:opacity-80'
        />
      </Link>
      <div className='mt-2 flex flex-col items-center justify-center gap-y-1'>
        <p className='text-sm font-medium'>个人信息</p>
        <p className='text-muted-foreground text-xs'>{user.name}</p>
      </div>
    </SidebarHeader>
  );
};
