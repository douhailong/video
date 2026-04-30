import { formatTimeDistance, formatCount } from '@/lib/utils';

import { OnePostTypes } from '@/modules/posts/types';

type ProfileProps = {
  // postId: string;
  // data: OnePostTypes;
};

const Profile = ({}: ProfileProps) => {
  return (
    <div className='bg-secondary cursor-pointer rounded-xl p-3 duration-300 hover:bg-[#fff5f0]'>
      <span className='text-sm font-medium'>
        {formatCount(100)} 次观看 {formatTimeDistance(new Date())}
      </span>
      <span className='line-clamp-3 break-words text-sm'>{'hhhhhhh'}</span>
      <button className='cursor-pointer text-sm font-medium'>...更多</button>
    </div>
  );
};

export default Profile;
