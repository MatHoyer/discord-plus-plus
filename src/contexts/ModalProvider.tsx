import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateServerModal from '@/components/modals/CreateServerModal';
import DeleteChannelMessageModal from '@/components/modals/DeleteChannelMessageModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';

const ModalProvider: React.FC = () => {
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
      <CreateChannelModal />
      <DeleteChannelMessageModal />
      <DeleteChannelModal />
    </>
  );
};

export default ModalProvider;
