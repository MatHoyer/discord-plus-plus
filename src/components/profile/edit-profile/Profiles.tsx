import { TEditProfileNavigationComponentProps } from '@/components/modals/EditProfileModal';
import React from 'react';

type TProfilesProps = TEditProfileNavigationComponentProps;

const Profiles: React.FC<TProfilesProps> = ({ user }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Profiles</h2>
    </div>
  );
};

export default Profiles;
