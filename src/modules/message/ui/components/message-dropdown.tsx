import { UserCircle, Bell } from 'lucide-react';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

type MessageDropdownProps = { children: React.ReactNode };

const MessageDropdown = ({ children }: MessageDropdownProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>通知</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MessageDropdown;
