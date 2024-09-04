'use client';

import EditChannelForm from '@/features/server/channel/edit-channel/EditChannelForm';
import { useModal } from '@/hooks/useModalStore';
import { SubmitButton } from '../form/SubmitButton';
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
          <DialogTitle className="text-2xl font-bold">
            Edit the channel
          </DialogTitle>
        </DialogHeader>
        <EditChannelForm channel={channel} close={closeModal}>
          {({ pending, form }) => (
            <DialogFooter>
              <SubmitButton
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
