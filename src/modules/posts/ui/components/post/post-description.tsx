import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

import { cn, formatTimeDistance, formatTime, intlNumber } from '@/lib/utils';

type PostDescriptionProps = {
  views: number;
  createdAt: Date;
  description: string | null;
};

const PostDescription = ({ createdAt, views, description }: PostDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const compactDate = formatTimeDistance(createdAt);
  const expandDate = formatTime(createdAt);

  const compactViews = intlNumber({ notation: 'compact', number: 100000 });
  const expandViews = intlNumber({ notation: 'standard', number: 100000 });

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className='bg-secondary/50 hover:bg-secondary/70 cursor-pointer rounded-xl p-3 transition'
    >
      <div className='mb-2 flex gap-3 text-sm'>
        <span className='font-medium'>
          {isExpanded ? expandViews : compactViews} 观看
        </span>
        <span className='font-medium'>{isExpanded ? expandDate : compactDate}</span>
      </div>
      <div className='relative'>
        <p className={cn('whitespace-pre-wrap text-sm', !isExpanded && 'line-clamp-2')}>
          {description}
        </p>
        <div className='mt-2 flex items-center gap-1 text-sm font-medium'>
          {isExpanded ? (
            <>
              收起 <ChevronUpIcon className='size-4' />
            </>
          ) : (
            <>
              更多 <ChevronDownIcon className='size-4' />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDescription;
