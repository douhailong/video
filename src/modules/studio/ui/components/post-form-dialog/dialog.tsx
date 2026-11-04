'use client';

import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { X, ArrowUpFromLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useDialog } from './store';
import Steps from './steps';
import Upload from './upload';
import { cn } from '@/lib/utils';

export function PostFormDialog() {
  const [isPicked, setIsPicked] = useState(false);

  const { isOpen, close } = useDialog();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 bg-black/80' />
        <Dialog.Content className='bg-background fixed inset-x-4 bottom-12 top-12 z-50 mx-auto flex max-w-4xl flex-col overflow-hidden rounded-3xl'>
          {/* <DialogHeader onClose={() => setIsPicked(!isPicked)}>
            <div className={cn('px-12 py-2 shadow', !isPicked && 'hidden')}>
              <Steps />
            </div>
          </DialogHeader>
          <div className={cn('flex-1 bg-stone-300', isPicked && 'hidden')}></div>
          <div className={cn('flex-1 bg-purple-200', !isPicked && 'hidden')}></div>
          <DialogFooter hidden={!isPicked} /> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type DialogHeaderProps = {
  children?: ReactNode;
  onClose: () => void;
};

function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <header className='shrink-0'>
      <div className='flex items-center justify-between border-b px-6 py-3'>
        <Dialog.Title className='text-xl font-semibold'>创建作品</Dialog.Title>
        <Dialog.Close asChild>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X />
          </Button>
        </Dialog.Close>
      </div>
      {children}
    </header>
  );
}

type DialogFooterProps = { hidden: boolean };

function DialogFooter({ hidden }: DialogFooterProps) {
  return (
    <footer
      className={cn('flex shrink-0 items-center border-t px-6 py-3', hidden && 'hidden')}
    >
      <div className='flex flex-1 items-center gap-2'>
        <ArrowUpFromLine className='size-6' />
        <span className='text-muted-foreground px-2 text-sm'>
          检查完毕。未发现任何问题。
        </span>
      </div>
      <Button variant='secondary' className='mr-2'>
        返回
      </Button>
      <Button>继续</Button>
    </footer>
  );
}
