'use client';

import { signOut } from 'next-auth/react';
import {
  HelpCircle,
  LanguagesIcon,
  LogOutIcon,
  Mails,
  MapPinIcon,
  SettingsIcon,
  SunIcon,
  UserPenIcon
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';

type AuthDropdownProps = {
  userName?: string | null;
  imageUrl?: string | null;
  email?: string | null;
  children: React.ReactNode;
};

const AuthDropdown = ({ userName, imageUrl, email, children }: AuthDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-64' align='start' side='left'>
        <DropdownMenuLabel>
          <div className='flex gap-2'>
            <UserAvatar size='lg' name={userName} imageUrl={imageUrl} />
            <div className='flex flex-col'>
              <p className='text-sm font-medium'>{userName}</p>
              <span className='text-muted-foreground line-clamp-1 text-xs'>{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
        // onClick={(e) => {
        //   // 点击不会关闭menu
        //   e.preventDefault();
        // }}
        >
          <UserPenIcon className='mr-2 size-4' />
          切换账号
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <LogOutIcon className='mr-2 size-4' />
          退出登录
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SunIcon className='mr-4 size-4' />
            外观
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>设备</DropdownMenuItem>
              <DropdownMenuItem>深色</DropdownMenuItem>
              <DropdownMenuItem>浅色</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LanguagesIcon className='mr-4 size-4' />
            语言
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>设备</DropdownMenuItem>
              <DropdownMenuItem>深色</DropdownMenuItem>
              <DropdownMenuItem>浅色</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MapPinIcon className='mr-4 size-4' />
            位置
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>设备</DropdownMenuItem>
              <DropdownMenuItem>深色</DropdownMenuItem>
              <DropdownMenuItem>浅色</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SettingsIcon className='mr-2 size-4' />
          设置
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className='mr-2 size-4' />
          帮助
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mails className='mr-2 size-4' />
          反馈
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropdown;
