'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { SmartphoneIcon, MailIcon, BookKeyIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icons from '@/components/icons';

type FormValues = {
  value: string;
};

type AuthDialogProps = { children: React.ReactNode };

const AuthDialog = ({ children }: AuthDialogProps) => {
  const [channel, setChannel] = useState<'mail' | 'phone'>('mail');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid }
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      value: ''
    }
  });

  const isMail = channel === 'mail';

  const onSubmit = (data: FormValues) => {
    const trimmedValue = data.value.trim();

    console.log(trimmedValue, 'trimmedValue');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='w-[420px]'>
        <DialogTitle className='sr-only'>Sign in</DialogTitle>
        <div>
          <div className='mb-5 flex size-16 items-center justify-center rounded-full bg-gray-100'>
            <BookKeyIcon className='text-muted-foreground size-7' />
          </div>
          <h1 className='mb-2 text-2xl font-semibold'>欢迎使用</h1>
          <p className='text-muted-foreground mb-5 text-sm'>请在下方登录或注册</p>
          <form className='flex flex-col gap-y-5' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-2'>
              <div className='flex items-center justify-between'>
                <label htmlFor='1' className='text-sm font-medium'>
                  {isMail ? '邮箱' : '手机号'}
                </label>
                <button
                  type='button'
                  className='text-muted-foreground flex cursor-pointer items-center gap-1.5'
                  onClick={() => setChannel(isMail ? 'phone' : 'mail')}
                >
                  {isMail ? (
                    <SmartphoneIcon className='size-3.5' />
                  ) : (
                    <MailIcon className='size-3.5' />
                  )}
                  <span className='text-sm'>使用{isMail ? '手机号' : '邮箱'}</span>
                </button>
              </div>
              <Input
                type='text'
                placeholder={isMail ? 'Email' : 'Password'}
                {...register('value', {
                  validate: (value) => value.trim().length > 0
                })}
              />
            </div>
            <Button type='submit' className='w-full'>
              登录
            </Button>
            <div className='relative border-b border-gray-200'>
              <span className='text-muted-foreground -translate-1/2 absolute left-1/2 bg-white px-4 text-xs'>
                或
              </span>
            </div>
            <div className='flex w-full items-center gap-3'>
              <Button
                type='button'
                variant='secondary'
                className='flex-1'
                onClick={() => signIn('google')}
              >
                <Icons.google className='size-4' />
                <span className='font-semibold text-gray-800'>Google</span>
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='flex-1'
                onClick={() => signIn('github')}
              >
                <Icons.github className='size-4' />
                <span className='font-semibold text-gray-800'>Github</span>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
