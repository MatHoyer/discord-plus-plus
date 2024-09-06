import React, { PropsWithChildren } from 'react';
import ProfileHeader from './ProfileHeader';
import SelectActivity from './SelectActivity';

type TProfileContentProps = {} & PropsWithChildren;

const ProfileContentSection: React.FC<TProfileContentProps> = ({
  children,
}) => {
  return <div className="m-4 p-2 bg-[#232528] rounded-md">{children}</div>;
};

type TProfileCardProps = {
  member: MemberWithUser;
  isSideBar?: boolean;
};

const ProfileCard: React.FC<TProfileCardProps> = ({
  member,
  isSideBar = false,
}) => {
  return (
    <div className="flex flex-col">
      <ProfileHeader member={member} />
      {isSideBar && (
        <ProfileContentSection>
          <SelectActivity member={member} />
        </ProfileContentSection>
      )}
    </div>
  );
};

export default ProfileCard;
