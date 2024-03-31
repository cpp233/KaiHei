import { create } from 'zustand';
import { Server } from '@prisma/client';
import { ServerWithMembersWithProfiles } from '@/types';

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'manageMembers';

interface ModalData {
  // server?: Server;
  server?: ServerWithMembersWithProfiles;
}

interface ModelStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  data: ModalData;
}

export const useModal = create<ModelStore>(set => ({
  type: null,
  isOpen: false,
  onOpen: (type, data) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
  data: {},
}));
