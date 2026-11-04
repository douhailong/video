'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useDialog as a } from './store';

export function useDialog() {
  const router = useRouter();
  const open = a((state) => state.open);

  return useCallback(() => {
    router.replace('/studio');
    open();
  }, [router, open]);
}
