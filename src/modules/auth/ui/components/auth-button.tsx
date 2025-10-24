import { UserCircle } from 'lucide-react';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

import AuthDialog from './auth-dialog';
import AuthDropdown from './auth-dropdown';

type AuthButtonProps = {
  type: 'simple' | 'complete';
};

const AuthButton = async ({ type }: AuthButtonProps) => {
  const session = await auth();
  const user = session?.user;

  if (user) {
    return (
      <AuthDropdown
        type={type}
        userName={user.name}
        imageUrl={user.image}
        email={user.email}
      >
        <UserAvatar className='cursor-pointer' name={user.name} imageUrl={user.image} />
      </AuthDropdown>
    );
  }

  return (
    <AuthDialog>
      <Button
        variant='outline'
        className='border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500'
      >
        <UserCircle />
        登录
      </Button>
    </AuthDialog>
  );
};

export default AuthButton;
