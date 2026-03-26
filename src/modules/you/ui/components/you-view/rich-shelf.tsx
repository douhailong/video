import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type RichShelfProps = {
  href: string;
  title: string;
  description?: string;
  actionButton?: ReactNode;
};

const RichShelf = ({ title, description, href, actionButton }: RichShelfProps) => {
  return (
    <div className='flex items-center justify-between pb-4 pl-2'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>{title}</h1>
        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
      <div className='flex gap-2'>
        {actionButton}
        <Button variant='outline' asChild>
          <Link href={href}>查看全部</Link>
        </Button>
        <Button size='icon' variant='outline'>
          <ChevronLeft />
        </Button>
        <Button size='icon' variant='outline'>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default RichShelf;
