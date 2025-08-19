'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { SearchIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

type FormValues = {
  query: string;
};

const SearchInput = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      query: ''
    }
  });

  const queryValue = watch('query');

  const onSubmit = (data: FormValues) => {
    const trimmedQuery = data.query.trim();

    if (trimmedQuery) {
      const url = new URL('/search', process.env.NEXT_PUBLIC_SERVER_URL);
      url.searchParams.set('query', encodeURIComponent(trimmedQuery));
      router.push(url.toString());
    }

    // const url = new URL('/studio', process.env.NEXT_PUBLIC_SERVER_URL);

    // if (queryText) {
    //   url.searchParams.set('query', encodeURIComponent(queryText));
    // }

    // if (!queryText) {
    //   url.searchParams.delete('query');
    // }
  };

  return (
    <form className='flex w-full' onSubmit={handleSubmit(onSubmit)}>
      <div className='relative w-full'>
        <input
          {...register('query', {
            validate: (value) => value.trim().length > 0
          })}
          type='text'
          placeholder='Search'
          className='w-full rounded-l-full border py-2 pl-4 pr-12 focus:border-blue-600 focus:outline-none'
        />
        {queryValue && (
          <Button
            size='icon'
            variant='ghost'
            type='button'
            onClick={() => reset()}
            className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full'
          >
            <XIcon className='text-gray-500' />
          </Button>
        )}
      </div>
      <button
        disabled={!isValid}
        type='submit'
        className='rounded-r-full border border-l-0 px-5 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <SearchIcon className='size-5' />
      </button>
    </form>
  );
};

export default SearchInput;
