import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useCreatePost } from '@/store/dialog/use-create-post';

export function useDialog() {
  const router = useRouter();
  const { open } = useCreatePost();

  return useCallback(() => {
    router.replace('/studio');
    open();
  }, []);
}
