import { PencilLine } from 'lucide-react';

import UserAvatar from '@/components/user-avatar';
import { trpc } from '@/trpc/server';

type ProfileSectionProps = {};

const ProfileSection = async ({}: ProfileSectionProps) => {
  const user = await trpc.users.getSelf();

  return (
    <div className='flex items-center gap-x-6 bg-green-200'>
      <UserAvatar className='cursor-pointer' size='xl' imageUrl={user.image} name={user.name} />
      <div className='flex flex-col gap-y-2'>
        <div className='flex items-center gap-2'>
          <p className='text-xl font-medium'>{user.name}</p>
          <button className='cursor-pointer'>
            <PencilLine className='size-4 text-gray-500 duration-300 hover:text-gray-600' />
          </button>
        </div>
        <div className='text-muted-foreground flex gap-3 text-sm'>
          <span>
            关注 <span className='text-white'>{user.followings}</span>
          </span>
          <span>
            粉丝 <span className='text-white'>{user.followers}</span>
          </span>
          <span>
            获赞 <span className='text-white'>{user.followers}</span>
          </span>
        </div>
        <p className='text-muted-foreground text-sm'>账号：{user.id}</p>
      </div>
    </div>
  );
};

export default ProfileSection;
