'use client';

import { useForm } from 'react-hook-form';
import { SearchIcon, XIcon } from 'lucide-react';

type FormValues = {
  query: string;
};

type QueryFormProps = {
  onChange: (query: string) => void;
};

const QueryForm = ({ onChange }: QueryFormProps) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className='w-82 relative h-full'>
      <SearchIcon className='absolute left-0.5 top-1/2 size-4 -translate-y-1/2 text-gray-500' />
      <input
        type='text'
        className='h-full w-full px-7 outline-none'
        placeholder='搜索作品'
        {...register('query')}
      />
      {queryValue && (
        <button
          type='button'
          onClick={() => reset()}
          className='absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer rounded-full text-gray-400 hover:text-gray-500'
        >
          <XIcon className='size-4' />
        </button>
      )}
    </form>
  );
};

export default QueryForm;
