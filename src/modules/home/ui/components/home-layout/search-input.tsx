'use client';

import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { SearchIcon, XIcon } from 'lucide-react';

import { SERVER_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';

type FormValues = {
  query: string;
};

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      query: searchParams.get('query') || ''
    }
  });

  const queryValue = watch('query');

  const onSubmit = (data: FormValues) => {
    const trimmedQuery = data.query.trim();
    const url = new URL('/search', SERVER_URL);

    url.searchParams.set('query', encodeURIComponent(trimmedQuery));
    router.push(url.href);
  };

  return (
    <form
      className='hidden h-10 w-full max-w-[600px] sm:flex'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='bg-background relative w-full'>
        <input
          {...register('query', {
            validate: (value) => value.trim().length > 0
          })}
          type='text'
          placeholder='搜索'
          className='ring-border w-full rounded-l-full py-2 pl-4 pr-12 outline-none ring-1 ring-inset focus:ring-blue-800'
        />
        {queryValue && (
          <Button
            size='icon'
            variant='ghost'
            type='button'
            onClick={() => reset({ query: '' })}
            className='absolute right-0 top-1/2 -translate-y-1/2'
          >
            <XIcon className='size-6' />
          </Button>
        )}
      </div>
      <button
        disabled={!isValid}
        type='submit'
        className='bg-secondary hover:bg-secondary/80 cursor-pointer rounded-r-full border border-l-0 px-5 transition-all'
      >
        <SearchIcon className='size-6' />
      </button>
    </form>
  );
};

export default SearchInput;
