'use client';

import Link from 'next/link';
import { useAuth, useClerk } from '@clerk/nextjs';
import { History, ListVideo, ThumbsUp } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'History',
    url: '/playlists/history',
    icon: History,
    auth: true
  },
  {
    title: 'Liked videos',
    url: '/playlists/liked',
    icon: ThumbsUp,
    auth: true
  },
  {
    title: 'All playlists',
    url: '/palylists',
    icon: ListVideo
  }
];

const MainSection = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false}
                onClick={(e) => {
                  if (item.auth && !isSignedIn) {
                    e.preventDefault();
                    return clerk.openSignIn();
                  }
                }}
              >
                <Link href={item.url} className='flex items-center gap-4'>
                  <item.icon />
                  <span className='text-sm'>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default MainSection;
