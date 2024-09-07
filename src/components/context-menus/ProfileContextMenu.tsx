'use client';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useModal } from '@/hooks/useModalStore';
import { useToast } from '@/hooks/useToast';
import { User, UserGuildProfile } from '@prisma/client';
import { AtSign, CircleUserRound, Fingerprint } from 'lucide-react';
import React, { ComponentProps, PropsWithChildren } from 'react';
import GenericContextMenu from './GenericContextMenu';

type TProfileContextMenuProps = {
  user: User;
  member?: UserGuildProfile;
};

const ProfileContextMenu: React.FC<
  TProfileContextMenuProps &
    PropsWithChildren &
    Omit<ComponentProps<typeof GenericContextMenu>, 'items'>
> = ({ user, member, children, ...props }) => {
  const { openModal } = useModal();
  const { toast } = useToast();

  const { addCurrentMemberMention } = useGlobalStore((state) => ({
    addCurrentMemberMention: state.addCurrentMemberMention,
  }));

  return (
    <GenericContextMenu
      {...props}
      items={[
        {
          label: 'Profile',
          icon: CircleUserRound,
          onClick: () => {
            openModal('memberProfile', { user, member });
          },
        },
        {
          label: 'Mention',
          icon: AtSign,
          when: !!member,
          onClick: () => {
            addCurrentMemberMention(member!);
          },
        },
        {
          seperator: true,
        },
        {
          label: 'Copy User ID',
          icon: Fingerprint,
          onClick: async () => {
            await navigator.clipboard.writeText(user.id.toString());
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
