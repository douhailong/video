'use client';

import { useState } from 'react';

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';

import UploadSection from '../components/create-section/upload-section';
import FormSection from '../components/create-section/form-section';

const CreateView = () => {
  const [percent, setPercent] = useState(0);

  const { mutateAsync, data } = trpc.studio.uploadpost.useMutation();

  const onDrop = async (files: File[]) => {
    const file = files[0];
    const formData = new FormData();

    formData.append('file', file);
    await mutateAsync(formData);

    setPercent(100);
  };

  return (
    <div className='max-w-screen-lg px-4 pb-4 pt-2.5'>
      <UploadSection onDrop={onDrop} className={cn(!!percent && 'hidden')} />
      <FormSection
        playbackUrl={data?.url}
        percent={percent}
        className={cn(!percent && 'hidden')}
      />
    </div>
  );
};

export default CreateView;
