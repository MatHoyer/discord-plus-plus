import CreateServerModal from '@/components/modals/CreateServerModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';

const ModalProvider: React.FC = () => {
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
    </>
  );
};

export default ModalProvider;
