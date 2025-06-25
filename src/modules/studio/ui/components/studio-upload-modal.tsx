'use client';

import { Plus, Loader2 } from 'lucide-react';

import { trpc } from '@/trpc/client';

import { Button } from '@/components/ui/button';
import AdapteModal from '@/components/adapte-modal';
import StudioUploader from './studio-uploader';

type StudioUploadModalProps = {};

const StudioUploadModal = ({}: StudioUploadModalProps) => {
  const utils = trpc.useUtils();

  const create = trpc.videos.create.useMutation({
    onSuccess: () => utils.studio.getMany.invalidate()
  });

  return (
    <>
      <AdapteModal
        title='Upload a video'
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader
            endpoint={create.data.url}
            onSuccess={() => {
              if (!create.data?.video.id) return;
              create.reset();
            }}
          />
        ) : (
          <Loader2 className='animate-spin' />
        )}
      </AdapteModal>
      <Button
        variant='secondary'
        disabled={create.isPending}
        onClick={() => create.mutate()}
      >
        {create.isPending ? <Loader2 className='animate-spin' /> : <Plus />}
        Create
      </Button>
    </>
  );
};

export default StudioUploadModal;
