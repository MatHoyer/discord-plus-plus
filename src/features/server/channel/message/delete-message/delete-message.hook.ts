import { socket } from '@/socket';
import { useAction } from 'next-safe-action/hooks';
import { ServerSocketEvents } from '../../../../../../server/socket/server';
import { deleteMessage } from './delete-message.action';

export const useDeleteMessage = (onSuccess?: () => void) =>
  useAction(deleteMessage, {
    onSuccess: ({ data }) => {
      onSuccess?.();
      socket.emit(ServerSocketEvents.deleteMessage, {
        messageId: data!.id,
        channelId: data!.channelId,
      });
    },
  });
