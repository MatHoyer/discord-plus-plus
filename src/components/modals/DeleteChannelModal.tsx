'use client';

import { deleteChannel } from '@/features/guild/channel/delete-channel/delete-channel.action';
import { useModal } from '@/hooks/useModalStore';
import { socket } from '@/socket';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { ServerSocketEvents } from '../../../server/socket/server';
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
  const { data: modalData, closeModal } = useModal();

  const modalDataRef = useRef(modalData);
  modalDataRef.current = modalData;

  const { execute } = useAction(deleteChannel, {
    onSuccess: ({ data }) => {
      if (modalDataRef.current?.currentChannelId === data?.channel?.id) {
        router.push(
          `/channels/${modalDataRef.current.channel?.guildId}/${data?.generalChannel?.id}`
        );
      }
      closeModal();
      socket.emit(ServerSocketEvents.deleteChannel, data?.channel);
    },
  });

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Delete a channel
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-bold">#{modalData.channel!.name}</span>?
          </DialogDescription>
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
                channelId: modalData.channel!.id,
                guildId: modalData.channel!.guildId!,
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
