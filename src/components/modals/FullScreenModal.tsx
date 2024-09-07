import React, { ComponentProps, PropsWithChildren } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';

type TFullScreenModalProps = {} & PropsWithChildren &
  ComponentProps<typeof Dialog>;

const FullScreenModal: React.FC<TFullScreenModalProps> = ({
  children,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <DialogContent
        className="h-screen max-w-screen sm:rounded-none inset-0"
        aria-describedby={undefined}
        showClose={false}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
