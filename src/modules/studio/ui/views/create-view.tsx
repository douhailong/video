'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { trpc } from '@/trpc/client';

import UploadSection from '../components/create-section/upload-section';
import FormSection from '../components/create-section/form-section';
import { cn } from '@/lib/utils';

const CreateView = () => {
  const [percent, setPercent] = useState(0);

  const startProgress = () => {
    setPercent(0);

    const interval = setInterval(() => {
      setPercent((pre) => {
        if (pre >= 95) {
          clearInterval(interval);
          return pre;
        }
        return pre + 5;
      });
    }, 500);

    return interval;
  };

  const { mutateAsync, data } = trpc.studio.uploadVideo.useMutation();

  const onDrop = async (files: File[]) => {
    const file = files[0];
    const formData = new FormData();
    const interval = startProgress();

    formData.append('file', file);

    await mutateAsync(formData);

    clearInterval(interval);
    setPercent(100);
  };

  return (
    <div className='max-w-screen-lg px-4 pb-4 pt-2.5'>
      <UploadSection onDrop={onDrop} className={cn(!!percent && 'hidden')} />
      <FormSection playbackUrl={data?.url} percent={percent} className={cn(!percent && 'hidden')} />
    </div>
  );
};

export default CreateView;
