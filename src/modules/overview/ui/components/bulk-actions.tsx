'use client';

import { XIcon, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type BulkActionsProps = {
  selectedIds: string[];
  onClose: () => void;
  onBatchDelete: () => void;
};

const BulkActions = ({ selectedIds, onClose, onBatchDelete }: BulkActionsProps) => {
  return (
    <div
      className={cn(
        'bg-foreground text-accent flex h-0 items-center justify-between overflow-hidden px-6 text-xs duration-150',
        selectedIds.length ? 'h-14' : '[&>*]:hidden'
      )}
    >
      <div className='flex gap-6'>
        <span>已选择 {selectedIds.length} 个视频</span>
        <div className='border-l' />
        <button className='flex gap-1'>
          修改
          <ChevronDown className='size-4' />
        </button>
        <div className='border-l' />
        <button className='flex gap-1'>
          添加到播放列表
          <ChevronDown className='size-4' />
        </button>
        <div className='border-l' />
        <MoreAction onBatchDelete={onBatchDelete} />
      </div>
      <Button size='icon' variant='ghost' onClick={onClose}>
        <XIcon />
      </Button>
    </div>
  );
};

export default BulkActions;

type MoreActionProps = { onBatchDelete: () => void };

function MoreAction({ onBatchDelete }: MoreActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex gap-1'>
          更多操作
          <ChevronDown className='size-4' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='right'>
        <DropdownMenuItem>下载</DropdownMenuItem>
        <DropdownMenuItem onClick={onBatchDelete}>永久删除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
