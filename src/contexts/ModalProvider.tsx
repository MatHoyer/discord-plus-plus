import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateServerModal from '@/components/modals/CreateServerModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';

const ModalProvider: React.FC = () => {
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
      <CreateChannelModal />
    </>
  );
};

export default ModalProvider;
