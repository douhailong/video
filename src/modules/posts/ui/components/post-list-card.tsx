import UserAvatar from '@/components/user-avatar';
import PostThumbnail from './post-thumbnail';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

type PostListCardProps = {};

const PostListCard = ({}: PostListCardProps) => {
  return (
    <div className='border-b py-6'>
      <div className='flex items-center gap-2'>
        <UserAvatar />
        <h2 className='text-xl font-semibold'>迈克尔</h2>
      </div>
      <div className='mt-6 flex'>
        <div className='w-61 mr-4 shrink-0'>
          <PostThumbnail
            className='group-hover:rounded-none'
            imageUrl='/placeholder.svg'
            alt='Thumbnail'
          />
        </div>
        <div className='flex flex-col'>
          <div className='flex justify-between'>
            <h4 className='text-lg'>
              构建和部署 B2B SaaS AI 支持平台 | Next.js
              15、React、Convex、Turborepo、Vapi、AWS
            </h4>
            <Button variant='ghost' size='icon' className='shrink-0'>
              <MoreVertical className='size-6' />
            </Button>
          </div>
          <p className='text-muted-foreground text-xs'>
            <span className='hover:text-accent-foreground cursor-pointer'>
              与安东尼奥一起编码
            </span>
            &nbsp;·&nbsp;
            <span>7.1万此观看</span>
            &nbsp;·&nbsp;
            <span>7天前</span>
          </p>
          <p className='text-muted-foreground my-2 line-clamp-2 text-xs'>
            💻 源代码：https://cwa.run/nodebase 🎨 免费资产：https://cwa.run/node-assets
            🎥 第 2 部分：即将推出 📚 资源：尝试 Inngest：https://cwa.run/node-inngest
            尝试 Polar：https://cwa.r💻 源代码：https://cwa.run/nodebase 🎨
            免费资产：https://cwa.run/node-assets 🎥 第 2 部分：即将推出 📚 资源：尝试
            Inngest：https://cwa.run/node-inngest 尝试 Polar：https://cwa.r
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostListCard;
