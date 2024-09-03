'use client';
import { useModal } from '@/hooks/useModalStore';
import { AtSign, CircleUserRound, Fingerprint } from 'lucide-react';
import React, { PropsWithChildren } from 'react';
import GenericContextMenu from './GenericContextMenu';

type TProfileContextMenuProps = {
  member: MemberWithUser;
};

const ProfileContextMenu: React.FC<
  TProfileContextMenuProps & PropsWithChildren
> = ({ member, children }) => {
  const { openModal } = useModal();

  return (
    <GenericContextMenu
      items={[
        {
          label: 'Profile',
          icon: CircleUserRound,
          onClick: () => {
            openModal('memberProfile', { member });
          },
        },
        {
          label: 'Mention',
          icon: AtSign,
        },
        {
          seperator: true,
        },
        {
          label: 'Copy User ID',
          icon: Fingerprint,
          onClick: async () => {
            await navigator.clipboard.writeText(member.id.toString());
          },
        },
      ]}
    >
      {children}
    </GenericContextMenu>
  );
};

export default ProfileContextMenu;
