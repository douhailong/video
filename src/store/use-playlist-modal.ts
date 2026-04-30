import { useEffect } from 'react';
import { create } from 'zustand';

const initialValues = {};

type UseInternalStore = {
  isOpen: boolean;
  values: { id?: string };
  open: (id?: string) => void;
  close: () => void;
  status: 'pending' | 'successful' | 'failed';
};

const useInternalStore = create<UseInternalStore>((set) => ({
  isOpen: false,
  open: (id) => set({ isOpen: true, values: { id } }),
  close: () => set({ isOpen: false, values: initialValues, status: 'pending' }),
  values: initialValues,
  status: 'pending'
}));

export function usePlaylistModal(callback: () => void) {
  const { status, ...rest } = useInternalStore();

  useEffect(() => {
    status === 'successful' && callback();
  }, [status]);

  return { ...rest };
}
