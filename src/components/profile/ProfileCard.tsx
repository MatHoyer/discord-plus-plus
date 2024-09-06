import React from 'react';
import ProfileHeader from './ProfileHeader';

type TProfileCardProps = {
  member: MemberWithUser;
};

const ProfileCard: React.FC<TProfileCardProps> = ({ member }) => {
  return (
    <div>
      <ProfileHeader member={member} />
    </div>
  );
};

export default ProfileCard;
