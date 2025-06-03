import { useEffect } from 'react';

import { Button } from './ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

type InfiniteScrollProps = {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

const InfiniteScroll = ({
  isManual,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}: InfiniteScrollProps) => {
  const { isIntersecting, targetRef } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, isManual]);

  return (
    <div className='flex flex-col items-center gpa-4 p-4'>
      <div ref={targetRef} className='h-1' />
      {hasNextPage ? (
        <Button
          variant='secondary'
          disabled={isFetchingNextPage || !hasNextPage}
          onClick={fetchNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </Button>
      ) : (
        <p className='text-xs text-muted-foreground'>You have reached the end of the list</p>
      )}
    </div>
  );
};

export default InfiniteScroll;
