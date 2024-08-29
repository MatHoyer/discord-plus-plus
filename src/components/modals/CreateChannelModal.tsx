'use client';

import CreateChannelForm from '@/features/server/channel/create-channel/CreateChannelForm';
import { useModal } from '@/hooks/useModalStore';
import { SubmitButton } from '../form/SubmitButton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const CreateChannelModal: React.FC = () => {
  const { isOpen, type, data, closeModal } = useModal();

  const open = isOpen && type === 'createChannel';

  if (!data.server) return null;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create a channel
          </DialogTitle>
        </DialogHeader>
        <CreateChannelForm serverId={data.server?.id} close={closeModal}>
          {({ pending, form }) => (
            <DialogFooter>
              <SubmitButton
                disabled={pending || !form.formState.isValid}
                loading={pending}
              >
                Create
              </SubmitButton>
            </DialogFooter>
          )}
        </CreateChannelForm>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
