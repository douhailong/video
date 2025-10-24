'use client';

import Link from 'next/link';
import { AlertTriangleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useDraft } from '@/modules/studio/hooks/use-draft';

const PostHint = () => {
  const { draft, removeDraft } = useDraft();

  if (!draft) {
    return null;
  }

  return (
    <div className='flex items-center justify-between rounded-md border px-3 py-1'>
      <div className='flex items-center gap-2'>
        <AlertTriangleIcon className='size-4.5 text-yellow-600' />
        <p className='text-sm font-medium'>你还有上次未发布的作品，是否继续编辑？</p>
      </div>
      <div className='flex gap-2'>
        <Button size='sm' variant='ghost' onClick={() => removeDraft()}>
          放弃
        </Button>
        <Button variant='secondary' size='sm' asChild>
          <Link href={`/studio/create/${draft.type}`}>编辑</Link>
        </Button>
      </div>
    </div>
  );
};

export default PostHint;
