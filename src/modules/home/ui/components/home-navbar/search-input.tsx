'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchInput = () => {
  const [value, setValue] = useState('');
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = new URL('/search', process.env.NEXT_PUBLIC_SERVER_URL);
    const trimValue = value.trim();

    if (trimValue !== '') {
      setValue(trimValue);
      url.searchParams.set('query', encodeURIComponent(trimValue));
      router.push(url.toString());
    }
  };

  return (
    <form className='w-full flex' onSubmit={onSubmit}>
      <div className='relative w-full'>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type='text'
          placeholder='Search'
          className='w-full rounded-l-full border pl-4 py-2 pr-12 focus:border-blue-500 focus:outline-none'
        />
        {value && (
          <Button
            size='icon'
            variant='ghost'
            type='button'
            onClick={() => setValue('')}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full'
          >
            <XIcon className='text-gray-500' />
          </Button>
        )}
      </div>
      <button
        disabled={!value.trim()}
        type='submit'
        className='px-5 border border-l-0 rounded-r-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700'
      >
        <SearchIcon className='size-5' />
      </button>
    </form>
  );
};

export default SearchInput;
