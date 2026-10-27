'use client';

import { useEffect, useState } from 'react';

import { CreatePostDialog } from '@/modules/studio/ui/components/create-post';
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
      <CreatePostDialog />
      <PlaylistFormModal />
    </>
  );
}
