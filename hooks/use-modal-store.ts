import { create } from 'zustand';
import { Channel, ChannelType, Server } from '@prisma/client';
import { ServerWithMembersWithProfiles } from '@/types';

export type ModalType =
  | 'invite'
  | 'createServer'
  | 'editServer'
  | 'deleteServer'
  | 'leaveServer'
  | 'manageMembers'
  | 'createChannel'
  | 'deleteChannel'
  | 'editChannel';

interface ModalData {
  // server?: Server;
  server?: ServerWithMembersWithProfiles;
  channelType?: ChannelType;
  channel?: Channel;
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
