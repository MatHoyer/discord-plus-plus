'use client';

import { deleteChannel } from '@/features/server/channel/delete-channel/delete-channel.action';
import { useModal } from '@/hooks/useModalStore';
import { socket } from '@/socket';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const DeleteChannelModal: React.FC = () => {
  const router = useRouter();
  const { isOpen, type, data: modalData, closeModal } = useModal();

  const { execute } = useAction(deleteChannel, {
    onSuccess: ({ data }) => {
      console.log(modalData?.currentChannelId, data?.channel?.id);

      if (modalData?.currentChannelId === data?.channel?.id) {
        router.push(
          `/servers/${data?.channel?.serverId}/channels/${data?.generalChannel?.id}`
        );
      }
      closeModal();
      socket.emit('delete-channel', data?.channel);
    },
  });
  const open = isOpen && type === 'deleteChannel';

  if (!modalData.channel) return null;
  const channel = modalData.channel!;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Delete a channel
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-bold">#{channel.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="link">Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              execute({
                channelId: channel.id,
                serverId: channel.serverId,
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

export default DeleteChannelModal;
