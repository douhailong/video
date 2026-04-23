'use client';

import { useForm } from 'react-hook-form';
import { ListFilter } from 'lucide-react';

type FormValues = {
  query: string;
};

type QueryFormProps = {
  onSubmitForm: (query: string) => void;
};

const QueryForm = ({ onSubmitForm }: QueryFormProps) => {
  const { register, handleSubmit } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      query: ''
    }
  });

  const onSubmit = ({ query }: FormValues) => {
    onSubmitForm(query.trim());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex h-12 items-center px-6'>
      <ListFilter className='size-5' />
      <input
        type='text'
        className='h-full w-full px-7 outline-none placeholder:text-sm'
        placeholder='过滤条件'
        {...register('query')}
      />
    </form>
  );
};

export default QueryForm;
