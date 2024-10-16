'use client';

import { useDeleteMessage } from '@/features/guild/channel/message/delete-message/delete-message.hook';
import { useModal } from '@/hooks/useModalStore';
import { getCustomDate } from '@/lib/utils';
import ChannelMessage from '../channel/channel-message/ChannelMessage';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const DeleteChannelMessageModal: React.FC = () => {
  const { closeModal, data } = useModal();

  const { execute } = useDeleteMessage(closeModal);

  const message = data.message!;

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden" aria-describedby={undefined}>
        {message && data.currentMember && data.channel && data.user && (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl font-bold">
                Delete message
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this message?
              </DialogDescription>
              <div
                style={{
                  boxShadow: '0 0 5px #242628',
                }}
              >
                <ChannelMessage
                  message={message}
                  time={getCustomDate(new Date(message.createdAt))}
                  currentMember={data.currentMember!}
                  preview
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[#2dc770] font-bold text-sm">
                  PROTIP:
                </span>
                <span className="text-xs text-zinc-500">
                  You can hold down shift when clicking delete message to bypass
                  this confirmation entirely.
                </span>
              </div>
            </DialogHeader>
            <DialogFooter className="mt-2">
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
                    guildId: data.channel!.guildId!,
                  });
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelMessageModal;
