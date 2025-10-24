'use client';

import { useTheme } from 'next-themes';
import {
  HelpCircle,
  Languages,
  LogOut,
  Mails,
  MapPin,
  Settings,
  Sun,
  UsersRound,
  Moon,
  TvMinimalPlay
} from 'lucide-react';

import { signOut } from 'next-auth/react';
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
  type: 'simple' | 'complete';
  userName?: string | null;
  imageUrl?: string | null;
  email?: string | null;
  children: React.ReactNode;
};

const AuthDropdown = ({
  type,
  userName,
  imageUrl,
  email,
  children
}: AuthDropdownProps) => {
  const { setTheme, theme } = useTheme();

  if (type === 'simple') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className='w-48' align='end' side='bottom'>
          <DropdownMenuItem>
            <TvMinimalPlay className='mr-2 size-4' />
            返回首页
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UsersRound className='mr-2 size-4' />
            切换账号
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            <LogOut className='mr-2 size-4' />
            退出登录
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {theme === 'dark' ? (
                <Moon className='mr-4 size-4' />
              ) : (
                <Sun className='mr-4 size-4' />
              )}
              外观
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  设备
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>深色</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  浅色
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-64' align='end' side='bottom'>
        <DropdownMenuLabel>
          <div className='flex gap-2'>
            <UserAvatar size='lg' name={userName} imageUrl={imageUrl} />
            <div className='flex flex-col'>
              <p className='line-clamp-1 text-base font-medium'>{userName}</p>
              <span className='text-muted-foreground line-clamp-1 text-sm'>{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UsersRound className='mr-2 size-4' />
          切换账号
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <LogOut className='mr-2 size-4' />
          退出登录
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === 'dark' ? (
              <Moon className='mr-4 size-4' />
            ) : (
              <Sun className='mr-4 size-4' />
            )}
            外观
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('system')}>设备</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>深色</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('light')}>浅色</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className='mr-4 size-4' />
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
            <MapPin className='mr-4 size-4' />
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
          <Settings className='mr-2 size-4' />
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
