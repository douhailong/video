'use client';

import { type LucideIcon, MoreVertical, Bookmark, Clock4 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type Actions = {
  icon: LucideIcon;
  text: string;
  onClick: (id: string) => void;
}[];

type ActionDropdownProp = {
  actions?: Actions;
  hiddenDefault?: boolean;
  id: string;
};

const ActionDropdown = ({ actions = [], hiddenDefault, id }: ActionDropdownProp) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        size='icon'
        variant='ghost'
        className='-mr-1 -mt-1'
        onClick={(e) => e.preventDefault()}
      >
        <MoreVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className='w-44' align='end' side='bottom'>
      <DropdownMenuItem>
        <Bookmark />
        保存到播放列表
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Clock4 />
        保存到稍后观看
      </DropdownMenuItem>
      {actions.map(({ text, icon: Icon, onClick }) => (
        <DropdownMenuItem
          key={text}
          onClick={(e) => {
            e.preventDefault();
            onClick(id);
          }}
        >
          <Icon />
          {text}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ActionDropdown;
