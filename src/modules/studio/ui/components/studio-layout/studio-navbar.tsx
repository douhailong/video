import Link from 'next/link';
import Image from 'next/image';
import { Video } from 'lucide-react';

import { SidebarTrigger } from '@/components/ui/sidebar';

import AuthButton from '@/modules/auth/ui/components/auth-button';
import MessageButton from '@/modules/message/ui/components/message-button';
import CreateDropdown from '@/modules/posts/ui/components/create-dropdown';

const StudioNavbar = () => (
  <header className='bg-background fixed inset-x-0 top-0 z-50 flex h-16 items-center px-2 shadow-sm sm:px-4'>
    <div className='flex w-full items-center justify-between gap-4'>
      <div className='flex flex-shrink-0 items-center gap-2 sm:gap-4'>
        <SidebarTrigger className='size-10 [&_svg]:size-6' />
        <Link href='/studio/create' className='relative h-6 w-24'>
          <Image src='/youtube-studio.svg' alt='youtube-logo' fill />
        </Link>
      </div>
      <div className='mr-2.5 flex flex-shrink-0 items-center gap-4'>
        <MessageButton />
        <CreateDropdown icon={<Video />} />
        <AuthButton type='simple' />
      </div>
    </div>
  </header>
);

export default StudioNavbar;
