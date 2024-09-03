import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateServerModal from '@/components/modals/CreateServerModal';
import DeleteChannelMessageModal from '@/components/modals/DeleteChannelMessageModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import EditChannelModal from '@/components/modals/EditChannelModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';
import MemberProfileModal from '@/components/modals/MemberProfileModal';

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
    </>
  );
};

export default ModalProvider;
