import { Channel, Member, Server } from '@prisma/client';
import { create } from 'zustand';

export type TModalType =
  | 'createServer'
  | 'invite'
  | 'createChannel'
  | 'members'
  | 'deleteChannelMessage'
  | 'deleteChannel';

type TModalData = {
  server?: Server;
  channel?: Channel;
  serverMessage?: ServerMessageWithSender;
  currentMember?: Member;
  currentChannelId?: number;
};

type TModalStore = {
  type: TModalType | null;
  isOpen: boolean;
  data: TModalData;
  openModal: (type: TModalType, data?: TModalData) => void;
  closeModal: () => void;
};

export const useModal = create<TModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  openModal: (type, data = {}) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: {} }),
}));
