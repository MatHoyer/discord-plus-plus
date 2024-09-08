'use client';

import { useModal } from '@/hooks/useModalStore';
import ProfileHeader from '../profile/ProfileHeader';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

const MemberProfileModal: React.FC = () => {
  const { isOpen, type, closeModal, data } = useModal();
  const open = isOpen && type === 'memberProfile';

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="p-0 overflow-hidden pb-4 bg-[#111214]"
        showClose={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only" />
        {data.member && data.user && (
          <ProfileHeader user={data.user} member={data.member} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemberProfileModal;
