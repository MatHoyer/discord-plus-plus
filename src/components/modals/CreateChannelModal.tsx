'use client';

import CreateChannelForm from '@/features/server/channel/create-channel/CreateChannelForm';
import { useModal } from '@/hooks/useModalStore';
import { SubmitButton } from '../form/SubmitButton';
import { Button } from '../ui/button';
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

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden">
        {!data.server ? null : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Create a channel
              </DialogTitle>
            </DialogHeader>
            <CreateChannelForm
              serverId={data.server?.id}
              close={closeModal}
              className="px-4"
            >
              {({ pending, form }) => (
                <DialogFooter>
                  <Button
                    variant="link"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    variant="blue"
                    disabled={pending || !form.formState.isValid}
                    loading={pending}
                  >
                    Create
                  </SubmitButton>
                </DialogFooter>
              )}
            </CreateChannelForm>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
