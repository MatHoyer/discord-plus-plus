import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateGuildModal from '@/components/modals/CreateGuildModal';
import DeleteChannelMessageModal from '@/components/modals/DeleteChannelMessageModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import EditChannelModal from '@/components/modals/EditChannelModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';
import MemberProfileModal from '@/components/modals/MemberProfileModal';
import UploadAttachmentModal from '@/components/modals/UploadAttachmentModal';

const ModalProvider: React.FC = () => {
  return (
    <>
      <CreateGuildModal />
      <InvitePeopleModal />
      <CreateChannelModal />
      <DeleteChannelMessageModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MemberProfileModal />
      <UploadAttachmentModal />
      <EditProfileModal />
    </>
  );
};

export default ModalProvider;
