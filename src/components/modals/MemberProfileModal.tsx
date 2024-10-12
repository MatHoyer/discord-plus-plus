'use client';

import { useModal } from '@/hooks/useModalStore';
import { ProfileHeaderWithContent } from '../profile/ProfileHeader';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

const MemberProfileModal: React.FC = () => {
  const { closeModal, data } = useModal();

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent
        className="p-0 overflow-hidden pb-4 bg-[#111214]"
        showClose={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only" />
        {data.member && data.user && (
          <ProfileHeaderWithContent user={data.user} member={data.member} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemberProfileModal;
