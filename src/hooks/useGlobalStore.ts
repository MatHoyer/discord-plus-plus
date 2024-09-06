import { create } from 'zustand';

type TGlobalStore = {
  unreadChannels: Set<number>;
  setUnreadChannels: (channelId: number) => void;
  setAsRead: (channelId: number) => void;
  channelMentions: Record<number, ServerMentionWithUser[]>;
  addChannelMention: (
    channelId: number,
    mention: ServerMentionWithUser
  ) => void;
  deleteChannelMention: (channelId: number, mentionId: number) => void;
  editingMessageId: number | undefined;
  setEditingMessageId: (id: number | undefined) => void;
  replyingToMessage: ServerMessageWithSender | undefined;
  setReplyingToMessage: (message: ServerMessageWithSender | undefined) => void;
  currentMentionnedMember: MemberWithUser | undefined;
  addCurrentMemberMention: (member: MemberWithUser | undefined) => void;
  removeCurrentMemberMention: () => void;
  flashReferencedMessageId: number | undefined;
  setFlashReferencedMessageId: (id: number | undefined) => void;
};

export const useGlobalStore = create<TGlobalStore>((set) => ({
  unreadChannels: new Set(),
  setUnreadChannels: (channelId) =>
    set((state) => {
      state.unreadChannels.add(channelId);
      return {
        unreadChannels: state.unreadChannels,
      };
    }),
  setAsRead: (channelId) =>
    set((state) => {
      state.unreadChannels.delete(channelId);
      if (state.channelMentions[channelId]) {
        state.channelMentions[channelId] = [];
      }
      return {
        unreadChannels: state.unreadChannels,
        channelMentions: state.channelMentions,
      };
    }),
  channelMentions: {},
  addChannelMention: (channelId, mention) =>
    set((state) => {
      state.channelMentions[channelId] = state.channelMentions[channelId] || [];
      state.channelMentions[channelId].push(mention);
      return { channelMentions: state.channelMentions };
    }),
  deleteChannelMention: (channelId, mentionId) =>
    set((state) => {
      if (!state.channelMentions[channelId])
        return { channelMentions: state.channelMentions };

      state.channelMentions[channelId] = state.channelMentions[
        channelId
      ].filter((m) => m.id !== mentionId);

      return { channelMentions: state.channelMentions };
    }),
  editingMessageId: 0,
  setEditingMessageId: (id) =>
    set(() => ({
      editingMessageId: id,
    })),
  replyingToMessage: undefined,
  setReplyingToMessage: (message) =>
    set((state) => ({
      replyingToMessage: state.editingMessageId ? undefined : message,
    })),
  currentMentionnedMember: undefined,
  addCurrentMemberMention: (member) =>
    set(() => ({ currentMentionnedMember: member })),
  removeCurrentMemberMention: () =>
    set(() => ({ currentMentionnedMember: undefined })),
  flashReferencedMessageId: undefined,
  setFlashReferencedMessageId: (id) =>
    set(() => {
      setTimeout(() => {
        set(() => ({ flashReferencedMessageId: undefined }));
      }, 3000);

      return { flashReferencedMessageId: id };
    }),
}));
