import { create } from 'zustand';

const initialValues = { id: '', title: '' };

type UsePlaylistModal = {
  isOpen: boolean;
  initialValues: typeof initialValues;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
};

export const usePlaylistModal = create<UsePlaylistModal>((set) => ({
  isOpen: false,
  onOpen: (id, title) => set({ isOpen: true, initialValues: { id, title } }),
  onClose: () => set({ isOpen: false, initialValues }),
  initialValues
}));
