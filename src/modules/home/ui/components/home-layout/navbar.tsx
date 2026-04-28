'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import Icons from '@/components/icons';
import { HomeLogo } from '@/components/logo';

const navs = [
  { href: '/', title: '首页', icon: Icons.home },
  { href: '/shorts', title: 'Shorts', icon: Icons.short },
  { href: '/feed/subscriptions', title: '订阅', icon: Icons.subscribe },
  { href: '/feed/you', title: '我', icon: Icons.you }
];

export function DesktopNavbar() {
  const pathname = usePathname();

  return (
    <div className='hidden sm:block'>
      <div className='w-18 fixed bottom-0 left-0 top-14 pt-1'>
        {navs.map(({ href, title, icon: Icon }) => (
          <Link
            className='bg-background hover:bg-secondary flex flex-col items-center justify-center gap-1.5 rounded-lg pb-3.5 pt-4'
            href={href}
            key={href}
          >
            <Icon className='size-6' active={href === pathname} />
            <span className='text-[10px]'>{title}</span>
          </Link>
        ))}
      </div>
      <div className='w-18' />
    </div>
  );
}

export function MobileNavbar() {
  const pathname = usePathname();

  return (
    <div className='block sm:hidden'>
      <div className='fixed inset-x-0 bottom-0 z-50 h-14 border-t bg-[rgba(255,255,255,0.9)] backdrop-blur-[48px]'>
        <div className='flex h-full items-center justify-between'>
          {navs.map(({ title, href, icon: Icon }) => (
            <Link
              key={href}
              className='flex h-full flex-1 flex-col items-center justify-center gap-0.5'
              href={href}
            >
              <Icon className='size-6' active={href === pathname} />
              <h4 className='text-[11px]'>{title}</h4>
            </Link>
          ))}
        </div>
      </div>
      <div className='h-14' />
    </div>
  );
}

export function DrawerNavbar() {
  const pathname = usePathname();

  const Trigger = () => (
    <SheetTrigger asChild>
      <Button size='icon' variant='ghost'>
        <Menu />
      </Button>
    </SheetTrigger>
  );

  return (
    <Sheet>
      <Trigger />
      <SheetContent
        className='text-sidebar-foreground w-60 gap-0 p-0 [&>button]:hidden'
        side='left'
      >
        <SheetHeader className='p-0'>
          <SheetTitle className='sr-only'>side navbar</SheetTitle>
          <div className='flex h-14 items-center gap-4 pl-2 sm:pl-4'>
            <Trigger />
            <HomeLogo />
          </div>
        </SheetHeader>
        <div className='p-3'>
          {/* TODO */}
          {navs.slice(0, -1).map(({ href, title, icon: Icon }) => {
            const active = href === pathname;
            return (
              <Button
                className={cn(
                  'px-3! w-full justify-start gap-6 rounded-md',
                  !active && 'font-normal'
                )}
                size='lg'
                variant={active ? 'secondary' : 'ghost'}
                key={href}
                asChild
              >
                <Link href={href}>
                  <Icon className='size-6' active={active} />
                  {title}
                </Link>
              </Button>
            );
          })}
        </div>
        <Separator />
      </SheetContent>
    </Sheet>
  );
}
