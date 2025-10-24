'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { SmileIcon, ImageIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';

type CommentFormProps = {
  postId: string;
  parentId?: string;
  feedbackId?: string;
  onSuccess?: () => void;
};

const CommentForm = ({ postId, parentId, feedbackId, onSuccess }: CommentFormProps) => {
  const [content, setContnet] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ postId });
      inputRef.current!.innerHTML = '';
      setContnet('');
      onSuccess?.();
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
      }
    }
  });

  return (
    <div className='focus-within:min-h-30 flex max-h-60 min-h-0 w-full flex-col overflow-hidden rounded-md bg-gray-100 transition-all focus-within:bg-transparent focus-within:ring focus-within:ring-blue-500'>
      <div
        ref={inputRef}
        className='empty:before:text-muted-foreground flex-1 overflow-auto break-all px-3 py-2.5 outline-none empty:before:text-sm empty:before:content-[attr(data-placeholder)]'
        contentEditable
        spellCheck={false}
        data-placeholder='留下你的精彩评论吧'
        onInput={(e: ChangeEvent<HTMLDivElement>) =>
          setContnet(e.target.innerText.trim())
        }
      />
      <div
        className='flex items-center justify-between px-3 pb-2'
        tabIndex={1}
        onFocus={() => inputRef.current?.focus()}
      >
        <div className='flex items-center gap-5'>
          <SmileIcon className='size-5.5 cursor-pointer text-gray-500' />
          <ImageIcon className='size-5.5 cursor-pointer text-gray-500' />
        </div>
        <div className='flex items-center gap-5'>
          <span className='text-muted-foreground text-xs'>
            <span>{content.length}</span> / 1000
          </span>
          <Button
            disabled={!content || create.isPending}
            onClick={() =>
              create.mutate({
                content,
                parentId,
                feedbackId,
                postId
              })
            }
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
