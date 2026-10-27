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
  { href: '/studio/overview', text: '内容', icon: FolderCog },
  { href: '/studio/analytics', text: '数据分析', icon: ChartColumn },
  { href: '/studio/translations', text: '字幕', icon: Captions }
];

const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className='border-nones z-40 pt-16' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <SidebarGroup>
          <SidebarMenu>
            {menus.map(({ href, text, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  size='lg'
                  tooltip={text}
                  asChild
                  isActive={pathname === href}
                >
                  <Link href={href} className='flex items-center gap-4'>
                    <Icon />
                    <span className='text-base'>{text}</span>
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
