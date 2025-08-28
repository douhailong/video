import Link from 'next/link';
import Image from 'next/image';

import { SidebarTrigger } from '@/components/ui/sidebar';

import AuthButton from '@/modules/auth/ui/components/auth-button';
import SearchInput from './search-input';
import PublishButton from './publish-button';

const HomeNavbar = () => {
  return (
    <header className='fixed inset-x-0 top-0 z-50 flex h-16 items-center bg-white px-2 pr-5'>
      <div className='flex w-full items-center gap-4'>
        <div className='flex flex-shrink-0 items-center space-x-2'>
          <SidebarTrigger />
          <Link href='/' className='flex items-center gap-2'>
            <Image src='/logo.svg' alt='Logo' width={32} height={32} />
            <h1 className='text-2xl font-semibold tracking-tighter'>Triangle</h1>
          </Link>
        </div>
        <div className='mx-auto flex max-w-[720px] flex-1'>
          <SearchInput />
        </div>
        <div className='flex flex-shrink-0 items-center gap-4'>
          <PublishButton />
          <AuthButton type='complete' />
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
