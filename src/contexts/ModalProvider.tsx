'use client';
import CreateChannelModal from '@/components/modals/CreateChannelModal';
import CreateGuildModal from '@/components/modals/CreateGuildModal';
import DeleteChannelMessageModal from '@/components/modals/DeleteChannelMessageModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import EditChannelModal from '@/components/modals/EditChannelModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import InvitePeopleModal from '@/components/modals/InvitePeopleModal';
import MemberProfileModal from '@/components/modals/MemberProfileModal';
import UploadAttachmentModal from '@/components/modals/UploadAttachmentModal';
import { TModalType, useModal } from '@/hooks/useModalStore';

const modalMapping: Record<TModalType, React.FC> = {
  createServer: CreateGuildModal,
  invite: InvitePeopleModal,
  createChannel: CreateChannelModal,
  deleteChannelMessage: DeleteChannelMessageModal,
  deleteChannel: DeleteChannelModal,
  editChannel: EditChannelModal,
  memberProfile: MemberProfileModal,
  uploadAttachment: UploadAttachmentModal,
  editProfile: EditProfileModal,
  members: () => null,
};

const ModalProvider: React.FC = () => {
  const { isOpen, type } = useModal();

  if (!isOpen || !type) return null;

  const Component = modalMapping[type];

  return <Component />;
};

export default ModalProvider;
