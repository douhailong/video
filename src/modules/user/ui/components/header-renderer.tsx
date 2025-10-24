import { auth } from '@/auth';
import Icons from '@/components/icons';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';

type HeaderRendererProps = {
  className?: string;
};

const HeaderRenderer = async ({ className }: HeaderRendererProps) => {
  const session = await auth();

  const user = session?.user;

  return (
    <div className={className}>
      <div className='flex gap-4'>
        <UserAvatar imageUrl={user?.image} name={user?.name} size='xl' />
        <div className='flex flex-col justify-center gap-2 md:justify-start'>
          <h1 className='text-4xl font-bold'>{user?.name}</h1>
          <p className='text-muted-foreground text-xs'>@hailongdou-k6j • 查看频道</p>
          <div className='hidden gap-2 pt-1.5 md:flex'>
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
      <div className='flex gap-2 pt-4 md:hidden'>
        <Button variant='secondary' size='sm' className='flex-1 text-xs'>
          切换账号
        </Button>
        <Button variant='secondary' size='sm' className='flex-1 text-xs'>
          Google账号
        </Button>
      </div>
    </div>
  );
};

export default HeaderRenderer;
