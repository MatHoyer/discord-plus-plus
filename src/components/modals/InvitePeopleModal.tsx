'use client';

import { generateNewInviteCode } from '@/features/guild/generate-new-invite-code/generate-new-invite-code.action';
import { useModal } from '@/hooks/useModalStore';
import { useOrigin } from '@/hooks/useOrigin';
import { cn } from '@/lib/utils';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import SwitchingButton from '../SwitchingButton';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const InvitePeopleModal: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const origin = useOrigin();
  const { closeModal, data, openModal } = useModal();
  const { guild } = data;

  const url = `${origin}/invite/${guild?.inviteCode}`;

  const { execute, isExecuting } = useAction(generateNewInviteCode, {
    onSuccess: ({ data }) => {
      openModal('invite', { guild: data! });
    },
  });

  const copyInviteLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Invite friends on <span className="font-bold">{guild?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-2">
          <Label className="uppercase text-xs font-bold">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled
              value={url}
            />
            <SwitchingButton
              condition={isCopied}
              initialContent={<Copy className="w-4 h-4" />}
              switchingContent={<Check className="w-4 h-4" />}
              size="icon"
              onClick={copyInviteLink}
              disabled={isExecuting}
            />
          </div>
          <Button
            disabled={isExecuting}
            onClick={() => {
              execute(guild!.id);
            }}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-3 p-0"
          >
            Generate a new link
            <RefreshCw
              className={cn('w-4 h-4 ml-2', isExecuting && 'animate-spin')}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePeopleModal;
