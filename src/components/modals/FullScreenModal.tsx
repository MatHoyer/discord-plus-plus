import React, { ComponentProps, PropsWithChildren } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

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
        <DialogTitle className="sr-only">Full screen modal</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
