import React from 'react';

type TProfileCardProps = {
  member: MemberWithUser;
};

const ProfileCard: React.FC<TProfileCardProps> = ({ member }) => {
  return <div>{member.username}</div>;
};

export default ProfileCard;
