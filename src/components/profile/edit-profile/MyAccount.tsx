import { TEditProfileNavigationComponentProps } from '@/components/modals/EditProfileModal';
import { Button } from '@/components/ui/button';
import React, { PropsWithChildren, useState } from 'react';
import ProfileHeader from '../ProfileHeader';

type TMyAccountProps = TEditProfileNavigationComponentProps;

const MyAccountField: React.FC<
  {
    label: string;
    value: React.ReactNode;
    onClick: () => void;
  } & PropsWithChildren
> = ({ label, value, onClick, children }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col space-y-1">
        <span className="uppercase text-xs text-zinc-400 font-semibold">
          {label}
        </span>
        <span className="text-sm text-zinc-200">{value}</span>
      </div>
      <div className="flex gap-2">
        {children}
        <Button
          size="sm"
          variant="secondary"
          className="px-4"
          onClick={onClick}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

const MyAccount: React.FC<TMyAccountProps> = ({ user, goTo }) => {
  const [isEmailMasked, setIsEmailMasked] = useState(true);
  const maskEmail = (email: string) =>
    email.replace(/^[^@]+/, (match) => '*'.repeat(match.length));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Account</h2>
      <div className="rounded-md bg-[#1e1f22]">
        <ProfileHeader user={user} />
        <div className="pt-12 pb-4 px-4">
          <div>coucou je suis mathieu</div>
          <div className="bg-[#2b2d31] py-3 px-4 rounded-md mt-4 space-y-6">
            <MyAccountField
              label="Display Name"
              value={user.name!}
              onClick={() => {
                goTo('Profiles');
              }}
            />
            <MyAccountField
              label="Username"
              value={user.username!}
              onClick={() => {}}
            />
            <MyAccountField
              label="Email"
              value={
                <div>
                  <span>
                    {isEmailMasked ? maskEmail(user.email!) : user.email}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-0"
                    onClick={() => {
                      setIsEmailMasked((prev) => !prev);
                    }}
                  >
                    {isEmailMasked ? 'Reveal' : 'Hide'}
                  </Button>
                </div>
              }
              onClick={() => {}}
            />
            <MyAccountField
              label="Phone Number"
              value="Not set"
              onClick={() => {}}
            >
              <Button variant="link" size="sm">
                Remove
              </Button>
            </MyAccountField>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
