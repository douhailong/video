'use client';

import { useForm } from 'react-hook-form';
import { ListFilter } from 'lucide-react';

const QueryForm = ({ onQuery }: { onQuery: (query: string) => void }) => {
  const { register, handleSubmit } = useForm<{ query: string }>({
    mode: 'onChange',
    defaultValues: {
      query: ''
    }
  });

  return (
    <form
      onSubmit={handleSubmit(({ query }) => onQuery(query.trim()))}
      className='flex h-12 items-center px-6'
    >
      <ListFilter className='size-6' />
      <input
        type='text'
        className='h-full w-full px-7 outline-none'
        placeholder='过滤条件'
        {...register('query')}
      />
    </form>
  );
};

export default QueryForm;
