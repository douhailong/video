'use client';

import { useForm } from 'react-hook-form';
import { SearchIcon, XIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';

type FormValues = {
  query: string;
};

type SearchInputProps = {
  onChange: (query: string) => void;
};

const SearchInput = ({ onChange }: SearchInputProps) => {
  const { register, handleSubmit, reset, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      query: ''
    }
  });

  const queryValue = watch('query');

  const onSubmit = ({ query }: FormValues) => {
    onChange(query.trim());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='relative'>
        <SearchIcon className='absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-500' />
        <Input type='text' className='w-80 px-7' placeholder='搜索作品' {...register('query')} />
        {queryValue && (
          <button
            type='button'
            onClick={() => {
              onChange('');
              reset();
            }}
            className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full text-gray-400 hover:text-gray-500'
          >
            <XIcon className='size-4' />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
