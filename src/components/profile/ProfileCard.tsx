import { useModal } from '@/hooks/useModalStore';
import { Fingerprint, LogOut, Pencil } from 'lucide-react';
import { signOut } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';
import ProfileHeader from './ProfileHeader';
import SelectActivity from './SelectActivity';

type TProfileContentProps = {} & PropsWithChildren;

const ProfileContentSection: React.FC<TProfileContentProps> = ({
  children,
}) => {
  return <div className="mx-4 p-2 bg-[#232528] rounded-md">{children}</div>;
};

const ProfileSectionButton: React.FC<
  { onClick?: () => void } & PropsWithChildren
> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-start items-center gap-2 bg-inherit hover:bg-[#2f3236] transition-colors rounded-md p-2 group"
    >
      {children}
    </button>
  );
};

const ProfileSectionSeparator: React.FC = () => {
  return <div className="bg-[#37393f] h-[1px] w-full my-2" />;
};

type TProfileCardProps = {
  member: MemberWithUser;
  isSideBar?: boolean;
};

const ProfileCard: React.FC<TProfileCardProps> = ({
  member,
  isSideBar = false,
}) => {
  const { openModal } = useModal();

  return (
    <div className="flex flex-col">
      <ProfileHeader member={member} />
      {isSideBar && (
        <div className="flex flex-col mb-4 gap-4">
          <ProfileContentSection>
            <ProfileSectionButton
              onClick={() => {
                openModal('editProfile', { currentMember: member });
              }}
            >
              <Pencil className="h-5 w-5 fill-zinc-400 text-[#232528] group-hover:text-[#37393f] transition-colors" />
              <p className="text-sm text-[#b0b4bb]">Edit profile</p>
            </ProfileSectionButton>
            <ProfileSectionSeparator />
            <ProfileSectionButton>
              <SelectActivity member={member} />
            </ProfileSectionButton>
          </ProfileContentSection>
          <ProfileContentSection>
            <ProfileSectionButton onClick={() => signOut()}>
              <LogOut className="h-4 w-4 text-zinc-400" />
              <p className="text-sm text-[#b0b4bb]">Log out</p>
            </ProfileSectionButton>
            <ProfileSectionSeparator />
            <ProfileSectionButton>
              <Fingerprint className="h-4 w-4 text-zinc-400" />
              <p className="text-sm text-[#b0b4bb]">Copy user id</p>
            </ProfileSectionButton>
          </ProfileContentSection>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
