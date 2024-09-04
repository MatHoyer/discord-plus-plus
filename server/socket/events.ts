export const ServerSocketEvents = {
  init: 'init',
  disconnect: 'disconnect',
  newMessage: 'new-message',
  editMessage: 'edit-message',
  mention: 'mention',
  reactedToMessage: 'reacted-to-message',
  deleteReaction: 'delete-reaction',
  deleteMessage: 'delete-message',
  changeActivity: 'change-activity',
  newChannel: 'new-channel',
  editChannel: 'edit-channel',
  deleteChannel: 'delete-channel',
  isTyping: 'is-typing',
  stopTyping: 'stop-typing',
};

export const ClientSocketEvents = {
  initActivity: 'init-activity',
  activityChange: 'activity-change',
  newChannel: 'new-channel',
  editChannel: 'edit-channel',
  deleteChannel: 'delete-channel',
};

export const ChannelSocketEvents = {
  newMessage: (channelId: number) => `channel:${channelId}:new-message`,
  editMessage: (channelId: number) => `channel:${channelId}:edit-message`,
  deleteMessage: (channelId: number) => `channel:${channelId}:delete-message`,
  reactedToMessage: (channelId: number) =>
    `channel:${channelId}:reacted-to-message`,
  deleteReaction: (channelId: number) => `channel:${channelId}:delete-reaction`,
  mention: (channelId: number) => `channel:${channelId}:mention`,
  isTyping: (channelId: number) => `channel:${channelId}:is-typing`,
  stopTyping: (channelId: number) => `channel:${channelId}:stop-typing`,
};

export const getChannelSocketEvents = (channelId: number) => {
  return Object.entries(ChannelSocketEvents).reduce((acc, [key, value]) => {
    acc[key] = value(channelId);
    return acc;
  }, {} as Record<keyof typeof ChannelSocketEvents, string>);
};
