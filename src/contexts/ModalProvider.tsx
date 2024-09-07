import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateServerModal from '@/components/modals/CreateServerModal';
import DeleteChannelMessageModal from '@/components/modals/DeleteChannelMessageModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import EditChannelModal from '@/components/modals/EditChannelModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';
import MemberProfileModal from '@/components/modals/MemberProfileModal';
import UploadAttachmentModal from '@/components/modals/UploadAttachmentModal';

const ModalProvider: React.FC = () => {
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
      <CreateChannelModal />
      <DeleteChannelMessageModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MemberProfileModal />
      <UploadAttachmentModal />
    </>
  );
};

export default ModalProvider;
