'use client';

import { useEffect, useState } from 'react';

import { PostFormDialog } from '@/modules/studio/ui/components/post-form-dialog';
import PlaylistFormModal from '@/modules/playlists/ui/components/playlist-modal';

export default function DialogProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PostFormDialog />
      <PlaylistFormModal />
    </>
  );
}
