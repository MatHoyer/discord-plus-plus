'use client';

import { useActivity } from '@/hooks/useActivityStore';
import { useSession } from 'next-auth/react';
import ProfilePopover from './ProfilePopover';

const SideBarProfile: React.FC<{ member: MemberWithUser }> = ({ member }) => {
  const users = useActivity((state) => state.users);
  const session = useSession();

  if (!session.data?.user) return null;

  return (
    <ProfilePopover member={member}>
      <div>yo</div>
    </ProfilePopover>
  );
};

export default SideBarProfile;
