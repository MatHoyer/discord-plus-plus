'use client';

import { useModal } from '@/hooks/useModalStore';
import { useOrigin } from '@/hooks/useOrigin';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import SwitchingButton from '../SwitchingButton';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const InvitePeopleModal: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const origin = useOrigin();
  const { isOpen, type, closeModal, data } = useModal();
  const { server } = data;
  const open = isOpen && type === 'invite';

  const url = `${origin}/invite/${server?.id}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Invite friends on <span className="font-bold">{server?.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div>
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
            />
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-3 p-0"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePeopleModal;
