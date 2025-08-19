import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type VideoDescriptionProps = {
  viewCount: number;
  createdAt: Date;
  description: string | null;
};

const VideoDescription = ({ createdAt, viewCount, description }: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const compactDate = formatDistanceToNow(createdAt, { addSuffix: true });
  const expandedDate = format(createdAt, 'd MMM yyyy');
  const compactViews = Intl.NumberFormat('cn', { notation: 'compact' }).format(viewCount);
  const expandedViews = Intl.NumberFormat('cn', { notation: 'standard' }).format(viewCount);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className='bg-secondary/50 hover:bg-secondary/70 cursor-pointer rounded-xl p-3 transition'
    >
      <div className='mb-2 flex gap-2 text-sm'>
        <span className='font-medium'>{isExpanded ? expandedViews : compactViews} views</span>
        <span className='font-medium'>{isExpanded ? expandedDate : compactDate}</span>
      </div>
      <div className='relative'>
        <p className={cn('whitespace-pre-wrap text-sm', !isExpanded && 'line-clamp-2')}>
          {description || 'No description'}
        </p>
        <div className='mt-2 flex items-center gap-1 text-sm font-medium'>
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon className='size-4' />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className='size-4' />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDescription;
