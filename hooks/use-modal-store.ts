import { create } from 'zustand';

export type ModalType = 'createServer' | 'editServer';

interface ModelStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModelStore>(set => ({
  type: null,
  isOpen: false,
  onOpen: type => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
