import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type VideoDescriptionProps = {
  compactViews: string;
  expandedViews: string;
  compactDate: string;
  expandedDate: string;
  description: string | null;
};

const VideoDescription = ({
  compactViews,
  expandedViews,
  compactDate,
  expandedDate,
  description
}: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className='bg-secondary/50 hover:bg-secondary/70 rounded-xl cursor-pointer p-3 transition'
    >
      <div className='flex gap-2 text-sm mb-2'>
        <span className='font-medium'>
          {isExpanded ? expandedViews : compactViews} views
        </span>
        <span className='font-medium'>
          {isExpanded ? expandedDate : compactDate}
        </span>
      </div>
      <div className='relative'>
        <p
          className={cn(
            'text-sm whitespace-pre-wrap',
            !isExpanded && 'line-clamp-2'
          )}
        >
          {description || 'No description'}
        </p>
        <div className='flex items-center gap-1 mt-2 text-sm font-medium'>
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
