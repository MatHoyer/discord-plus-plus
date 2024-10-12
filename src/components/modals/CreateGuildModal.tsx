'use client';

import CreateGuileForm from '@/features/guild/create-guild/CreateGuildForm';
import { useModal } from '@/hooks/useModalStore';
import { SubmitButton } from '../form/SubmitButton';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const CreateGuildModal: React.FC = () => {
  const { closeModal } = useModal();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <CreateGuileForm close={closeModal} className="px-4">
          {(pending) => (
            <DialogFooter>
              <Button
                variant="link"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </Button>
              <SubmitButton variant="blue" loading={pending}>
                Create
              </SubmitButton>
            </DialogFooter>
          )}
        </CreateGuileForm>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuildModal;
