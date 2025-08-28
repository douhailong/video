'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import UserAvatar from '@/components/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';

const StudioSidebarHeader = () => {
  const { state } = useSidebar();
  const { data } = useSession();

  const user = data?.user;

  if (!user) {
    return (
      <SidebarHeader className='flex items-center justify-center pb-4'>
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
    <SidebarHeader className='flex items-center justify-center pb-4'>
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

export default StudioSidebarHeader;
