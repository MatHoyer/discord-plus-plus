import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateServerModal from '@/components/modals/CreateServerModal';
import DeleteChannelMessageModal from '@/components/modals/DeleteChannelMessageModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';

const ModalProvider: React.FC = () => {
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
      <CreateChannelModal />
      <DeleteChannelMessageModal />
    </>
  );
};

export default ModalProvider;
