'use client';
import { useModal } from '@/hooks/useModalStore';
import { useToast } from '@/hooks/useToast';
import { AtSign, CircleUserRound, Fingerprint } from 'lucide-react';
import React, { ComponentProps, PropsWithChildren } from 'react';
import GenericContextMenu from './GenericContextMenu';

type TProfileContextMenuProps = {
  member: MemberWithUser;
};

const ProfileContextMenu: React.FC<
  TProfileContextMenuProps &
    PropsWithChildren &
    Omit<ComponentProps<typeof GenericContextMenu>, 'items'>
> = ({ member, children, ...props }) => {
  const { openModal } = useModal();
  const { toast } = useToast();

  return (
    <GenericContextMenu
      {...props}
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
            toast({
              title: 'User ID copied successfully',
              duration: 2000,
            });
          },
        },
      ]}
    >
      {children}
    </GenericContextMenu>
  );
};

export default ProfileContextMenu;
