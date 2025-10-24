import Link from 'next/link';
import Image from 'next/image';
import { Mic, Plus, Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import MessageButton from '@/modules/message/ui/components/message-button';
import AuthButton from '@/modules/auth/ui/components/auth-button';
import CreateDropdown from '@/modules/posts/ui/components/create-dropdown';
import { SheetNavbar } from './side-navbar';
import SearchInput from './search-input';

const HeadeNavbar = () => {
  return (
    <header className='fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between bg-[rgba(255,255,255,0.9)] px-2 backdrop-blur-[48px] sm:px-4'>
      <div className='flex items-center gap-4'>
        <SheetNavbar>
          <Button className='size-10' variant='ghost'>
            <Menu className='size-6' />
          </Button>
        </SheetNavbar>
        <Link href='/' className='w-23 relative h-8'>
          <Image src='/youtube-logo.svg' alt='youtube-logo' fill />
        </Link>
      </div>
      <div className='sm:pl-13 flex flex-none shrink basis-[732px] items-center justify-end sm:gap-4'>
        <SearchInput />
        <Button variant='ghost' className='size-10 sm:hidden'>
          <Search className='size-6' />
        </Button>
        <Button variant='secondary' className='size-10 max-sm:hidden'>
          <Mic className='size-6' />
        </Button>
        <Button variant='ghost' className='size-10 sm:hidden'>
          <Mic className='size-6' />
        </Button>
      </div>
      <div className='flex items-center justify-end sm:min-w-[225px] sm:gap-2'>
        <CreateDropdown variant='secondary' icon={<Plus className='size-6' />} />
        <MessageButton />
        <div className='flex items-center justify-center px-3.5'>
          <AuthButton type='complete' />
        </div>
      </div>
    </header>
  );
};

export default HeadeNavbar;
