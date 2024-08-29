'use client';

import CreateServerForm from '@/features/server/create-server/CreateServerForm';
import { useModal } from '@/hooks/useModalStore';
import { SubmitButton } from '../form/SubmitButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const CreateServerModal: React.FC = () => {
  const { isOpen, type, closeModal } = useModal();

  const open = isOpen && type === 'createServer';

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <CreateServerForm close={closeModal}>
          {(pending) => (
            <DialogFooter>
              <SubmitButton loading={pending}>Create</SubmitButton>
            </DialogFooter>
          )}
        </CreateServerForm>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
