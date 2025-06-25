'use client';

import { toast } from 'sonner';

import AdapteModal from '@/components/adapte-modal';
import { UploadDropzone } from '@/lib/uploadthing';
import { trpc } from '@/trpc/client';

type ThumbnailUploadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
};

const ThumbnailUploadModal = ({
  open,
  onOpenChange,
  videoId
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();

  const onClientUploadComplete = () => {
    utils.studio.getOne.invalidate({ id: videoId });
    onOpenChange(false);
    toast.success('Thumbnail updated');
  };

  return (
    <AdapteModal
      title='Upload a thumbnail'
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint='thumbnailUploader'
        input={{ videoId }}
        onClientUploadComplete={onClientUploadComplete}
      />
    </AdapteModal>
  );
};

export default ThumbnailUploadModal;
