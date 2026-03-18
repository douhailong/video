'use client';

import { Search, ArrowLeft, Mic } from 'lucide-react';

import { Button } from '@/components/ui/button';

type SearchSuggestionProps = {};

const SearchSuggestion = ({}: SearchSuggestionProps) => {
  return (
    <div className='fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-4 bg-[rgba(255,255,255,0.9)] px-2 backdrop-blur-[48px]'>
      <Button size='icon' variant='ghost'>
        <ArrowLeft />
      </Button>
      <form className='bg-secondary flex h-8 w-full items-center rounded-full px-4'>
        <input
          className='h-full w-full outline-none'
          placeholder='在 YouTube clone 中搜索'
        />
        <Button size='icon' variant='ghost'>
          <Search />
        </Button>
      </form>
      <Button size='icon' variant='secondary'>
        <Mic />
      </Button>
    </div>
  );
};

export default SearchSuggestion;
