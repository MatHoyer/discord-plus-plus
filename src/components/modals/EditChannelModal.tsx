'use client';

import EditChannelForm from '@/features/guild/channel/edit-channel/EditChannelForm';
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

const EditChannelModal: React.FC = () => {
  const { isOpen, type, data, closeModal } = useModal();

  const open = isOpen && type === 'editChannel';

  if (!data.channel) return null;
  const { channel } = data;

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit the channel
          </DialogTitle>
        </DialogHeader>
        <EditChannelForm channel={channel} close={closeModal} className="px-4">
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
                Edit
              </SubmitButton>
            </DialogFooter>
          )}
        </EditChannelForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
