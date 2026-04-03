import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ColumnCard } from '@/components/card';

type ActionBarProps = {
  href: string;
  title: string;
  description?: string;
  actionButton?: ReactNode;
  children?: ReactNode;
};

const ActionBar = ({
  title,
  description,
  href,
  actionButton,
  children
}: ActionBarProps) => {
  return (
    <div className='px-4 sm:px-0'>
      <div className='flex items-center justify-between gap-4 pb-4'>
        <div className='flex flex-col gap-0.5'>
          <h2 className='text-xl font-semibold'>{title}</h2>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </div>
        <div className='flex items-center gap-2'>
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
      {children}
    </div>
  );
};

const ActionBarContent = ({ children }: { children: ReactNode }) => {
  const data = Array.from({ length: 10 });

  return <div className='bg-green-300'>1</div>;

  // return (
  //   <div className='grid grid-cols-4 gap-4'>
  //     {data.map((i) => (
  //       <ColumnCard.Loading />
  //     ))}
  //   </div>
  // );
};

export { ActionBar, ActionBarContent };
