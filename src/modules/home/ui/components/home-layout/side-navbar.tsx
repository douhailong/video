'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Sheet, SheetTrigger, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icons from '@/components/icons';

const navs = [
  { href: '/', title: '首页', icon: Icons.home },
  { href: '/shorts', title: 'Shorts', icon: Icons.short },
  { href: '/feed/subscriptions', title: '订阅', icon: Icons.subscribe },
  { href: '/feed/you', title: '我', icon: Icons.you }
];

export const SideNavbar = () => {
  const pathname = usePathname();

  if (pathname === '/watch') {
    return null;
  }

  return (
    <div className={cn(pathname === '/watch' && 'hidden')}>
      <div className='w-18 fixed bottom-0 left-0 top-14 hidden flex-col px-1 pt-1 sm:flex'>
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
      <div className='w-18 hidden sm:block' />
    </div>
  );
};

export const SheetNavbar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className='text-sidebar-foreground w-60 gap-0 p-0 [&>button]:hidden'
        side='left'
      >
        <SheetHeader className='p-0'>
          <div className='flex h-14 items-center gap-4 pl-4'>
            <SheetTrigger asChild>
              <Button className='size-10' variant='ghost'>
                <Menu className='size-6' />
              </Button>
            </SheetTrigger>
            <Link href='/' className='w-23 relative h-8'>
              <Image src='/youtube-logo.svg' alt='youtube-logo' fill />
            </Link>
          </div>
        </SheetHeader>
        <div className='p-3'>
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
};
