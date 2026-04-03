import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user-avatar';
import Icons from '@/components/icons';

const YouHead = async () => {
  const session = await auth();

  // await new Promise((res) => {
  //   setTimeout(() => res(1), 2000);
  // });

  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className='px-4 sm:px-0'>
      <div className='flex gap-4'>
        <UserAvatar imageUrl={user.image} name={user.name} size='xl' />
        <div className='flex flex-col justify-center gap-2 sm:justify-start'>
          <h1 className='text-4xl font-bold'>{user.name}</h1>
          <p className='text-muted-foreground text-xs'>@hailongdou-k6j • 查看频道</p>
          <div className='hidden gap-2 pt-1.5 sm:flex'>
            <Button variant='secondary' size='sm' className='text-xs'>
              切换账号
            </Button>
            <Button variant='secondary' size='sm' className='text-xs'>
              <Icons.google />
              Google账号
            </Button>
          </div>
        </div>
      </div>
      <div className='flex gap-2 pt-4 sm:hidden'>
        <Button variant='secondary' size='sm' className='flex-1 text-xs'>
          切换账号
        </Button>
        <Button variant='secondary' size='sm' className='flex-1 text-xs'>
          <Icons.google />
          Google账号
        </Button>
      </div>
    </div>
  );
};

YouHead.Loading = () => (
  <div className='px-4 sm:px-0'>
    <div className='flex gap-4'>
      <Skeleton className='size-[120px] rounded-full' />
      <div className='flex flex-col justify-center gap-2 sm:justify-start'>
        <Skeleton className='h-8 w-24 rounded-none' />
        <Skeleton className='h-5 w-44 rounded-none' />
        <div className='hidden gap-2 pt-1.5 sm:flex'>
          <Skeleton className='w-19 h-8 rounded-none' />
          <Skeleton className='w-26 h-8 rounded-none' />
        </div>
      </div>
    </div>
    <div className='flex gap-2 pt-4 sm:hidden'>
      <Skeleton className='h-9 flex-1 rounded-none' />
      <Skeleton className='h-9 flex-1 rounded-none' />
    </div>
  </div>
);

export { YouHead };
