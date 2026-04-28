import { Plus, Search, Mic } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HomeLogo } from '@/components/logo';

import MessageButton from '@/modules/message/ui/components/message-button';
import AuthButton from '@/modules/auth/ui/components/auth-button';
import CreateDropdown from '@/components/create-dropdown';

import { DrawerNavbar } from './navbar';
import SearchInput from './search-input';

export function Headbar() {
  return (
    <header className='fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between bg-[rgba(255,255,255,0.9)] px-2 backdrop-blur-[48px] sm:px-4 dark:bg-[rgba(15,15,15,0.8)]'>
      <div className='flex items-center gap-2 sm:gap-4'>
        <DrawerNavbar />
        <HomeLogo />
      </div>
      <div className='ml-6 mr-5 hidden flex-none shrink basis-[732px] items-center justify-end gap-4 sm:flex md:ml-10 md:mr-8'>
        <SearchInput />
        <Button variant='secondary' size='icon'>
          <Mic />
        </Button>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='inline-flex sm:hidden'>
          <Search />
        </Button>
        <CreateDropdown variant='secondary' icon={<Plus />} />
        <MessageButton />
        <AuthButton className='mx-3.5' type='simple' />
      </div>
    </header>
  );
}
