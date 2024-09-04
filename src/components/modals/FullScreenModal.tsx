import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface FullScreenModalProps {}

const FullScreenModal: React.FC<FullScreenModalProps> = () => {
  return (
    <Dialog>
      <DialogContent
        className="overflow-hidden h-screen max-w-screen"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit the channel
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
