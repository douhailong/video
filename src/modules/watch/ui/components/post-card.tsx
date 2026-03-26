import Link from 'next/link';
import { MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Thumbnail from '@/components/thumbnail';
import { Player } from '@/components/player';

type PostCardProps = {};

const PostCard = ({}: PostCardProps) => {
  return (
    <div className='flex w-full'>
      <Link href='' className='w-42 mr-2 shrink-0'>
        <div className='aspect-video overflow-hidden rounded-none duration-150 hover:rounded-none sm:rounded-lg'>
          <Thumbnail
            className='group-hover:hidden'
            thumbUrl='/placeholder.svg'
            size='sm'
            duration={100}
          />
          <Player className='relative hidden group-hover:block' />
        </div>
      </Link>
      <div className='flex flex-col'>
        <h3 className='line-clamp-3 text-sm font-medium'>
          让我们使用微服务架构和 ImageKit 构建一个多供应商电子 商务 SaaS | 第 2/3 部分
        </h3>
        <span className='text-muted-foreground text-xs'>antiod</span>
        <div className='text-muted-foreground text-xs'>
          <span>2.2万次观看</span>
          &nbsp;·&nbsp;
          <span>一个月前</span>
        </div>
      </div>
      <Button variant='ghost' size='icon'>
        <MoreVertical />
      </Button>
    </div>
  );
};

export default PostCard;
