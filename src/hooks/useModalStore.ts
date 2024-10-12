import { Channel, Guild, User, UserGuildProfile } from '@prisma/client';
import { create } from 'zustand';

export type TModalType =
  | 'createServer'
  | 'invite'
  | 'createChannel'
  | 'members'
  | 'deleteChannelMessage'
  | 'deleteChannel'
  | 'editChannel'
  | 'memberProfile'
  | 'uploadAttachment'
  | 'editProfile';

type TModalData = {
  guild?: Guild;
  channel?: Channel;
  message?: MessageWithSender;
  currentMember?: MemberWithUser;
  currentChannelId?: number;
  member?: UserGuildProfile;
  user?: User;
};

type TModalDataRequirements = {
  invite: { guild: Guild };
  createChannel: { guild: Guild };
  members: { guild: Guild };
  editChannel: { channel: Channel };
  deleteChannelMessage: {
    message: MessageWithSender;
    currentMember: MemberWithUser;
    channel: Channel;
    user: User;
  };
  deleteChannel: {
    channel: Channel;
    currentChannelId: number;
  };
  editProfile: {
    user: User;
  };
  memberProfile: {
    user: User;
    member?: UserGuildProfile;
  };
  uploadAttachment: {
    channel: Channel;
  };
};

type TModalDataMap<T extends TModalType> =
  T extends keyof TModalDataRequirements
    ? TModalDataRequirements[T]
    : TModalData;

type TModalStore = {
  type: TModalType | null;
  isOpen: boolean;
  data: TModalData;
  openModal: <T extends TModalType>(type: T, data?: TModalDataMap<T>) => void;
  closeModal: () => void;
};

export const useModal = create<TModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  openModal: (type, data) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: {} }),
}));

export const openModal = useModal.getState().openModal;
