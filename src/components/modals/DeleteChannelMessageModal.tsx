'use client';

import { deleteMessage } from '@/features/server/channel/delete-message/delete-message.action';
import { useModal } from '@/hooks/useModalStore';
import { getCustomDate } from '@/lib/utils';
import { socket } from '@/socket';
import { useAction } from 'next-safe-action/hooks';
import ChannelMessage from '../channel/ChannelMessage';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const DeleteChannelMessageModal: React.FC = () => {
  const { isOpen, type, closeModal, data } = useModal();

  const { execute } = useAction(deleteMessage, {
    onSuccess: ({ data }) => {
      closeModal();
      socket.emit('delete-message', {
        messageId: data!.id,
        channelId: data!.channelId,
      });
    },
  });

  const open = isOpen && type === 'deleteChannelMessage';

  const message = data.serverMessage!;

  if (!message || !data.currentMember || !data.channel) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">
            Delete message
          </DialogTitle>
          <p>Are you sure you want to delete this message?</p>
          <div
            className="p-3"
            style={{
              boxShadow: '0 0 3px #3133388b',
            }}
          >
            <ChannelMessage
              message={message}
              time={getCustomDate(new Date(message.createdAt))}
              currentMember={data.currentMember!}
              preview
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="link"
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              execute({
                channelId: message.channelId,
                messageId: message.id,
                serverId: data.channel!.serverId,
              });
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelMessageModal;
