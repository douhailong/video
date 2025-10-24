import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type RichShelfProps = {
  totalUrl?: string;
  title: string;
  description?: string;
};

const RichShelf = ({ title, description }: RichShelfProps) => {
  return (
    <div className='flex items-center justify-between pb-4 pl-2'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>{title}</h1>
        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
      <div className='flex gap-2'>
        <Button size='icon' variant='ghost'>
          <Plus className='size-6' />
        </Button>

        <Button variant='outline' asChild>
          <Link href=''>查看全部</Link>
        </Button>
        <Button size='icon' variant='outline'>
          <ChevronLeft className='size-6' />
        </Button>
        <Button size='icon' variant='outline'>
          <ChevronRight className='size-6' />
        </Button>
      </div>
    </div>
  );
};

export default RichShelf;
