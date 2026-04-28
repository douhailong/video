'use client';

import { useEffect, useState } from 'react';

import PlaylistFormModal from '@/modules/playlists/ui/components/playlist-modal';

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PlaylistFormModal />
    </>
  );
}
