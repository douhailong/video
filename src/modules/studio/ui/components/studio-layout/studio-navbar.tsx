import Link from 'next/link';
import Image from 'next/image';
import { Video } from 'lucide-react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import AuthButton from '@/modules/auth/ui/components/auth-button';
import MessageButton from '@/modules/message/ui/components/message-button';
import CreateDropdown from '@/modules/posts/ui/components/create-dropdown';

const StudioNavbar = () => {
  return (
    <header className='bg-background fixed inset-x-0 top-0 z-50 flex h-16 items-center px-2 pr-5 shadow-sm'>
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex flex-shrink-0 items-center space-x-3'>
          <SidebarTrigger />
          <Link href='/studio' className='flex items-center gap-1'>
            <Image src='/logo.svg' alt='logo' width={32} height={32} />
            <h1 className='text-xl font-semibold tracking-tighter'>创作中心</h1>
          </Link>
        </div>
        <div className='flex flex-shrink-0 items-center gap-5'>
          <MessageButton />
          <CreateDropdown icon={<Video className='size-5' />} />
          <AuthButton type='simple' />
        </div>
      </div>
    </header>
  );
};

export default StudioNavbar;
