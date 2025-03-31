'use client';

import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import { UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

type AuthButtonProps = {};

const AuthButton: React.FC<AuthButtonProps> = ({}) => {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'>
          <Button
            variant='outline'
            className='px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 rounded-full shadow-none border-blue-500/20'
          >
            <UserCircle />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default AuthButton;
