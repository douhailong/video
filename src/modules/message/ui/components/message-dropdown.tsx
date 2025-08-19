import { UserCircle, Bell } from 'lucide-react';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

type MessageDropdownProps = { children: React.ReactNode };

const MessageDropdown = ({ children }: MessageDropdownProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
        {/* <button className='relative flex-shrink-0 cursor-pointer text-gray-700 transition-all hover:opacity-80'>
          <Bell className='size-6' />
          <div className='absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-xs text-white'>
            <span className='scale-75'>{33}</span>
          </div>
        </button> */}
      </TooltipTrigger>
      <TooltipContent>
        <p>通知</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MessageDropdown;
