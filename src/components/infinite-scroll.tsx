import { useEffect } from 'react';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { Button } from './ui/button';

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
    <div className='gpa-4 flex flex-col items-center p-4'>
      <div ref={targetRef} className='h-1' />
      {hasNextPage ? (
        <Button
          variant='secondary'
          disabled={isFetchingNextPage || !hasNextPage}
          onClick={fetchNextPage}
        >
          {isFetchingNextPage ? '加载中...' : '加载更多'}
        </Button>
      ) : (
        <p className='text-muted-foreground text-xs'>已经到底了</p>
      )}
    </div>
  );
};

export default InfiniteScroll;
