'use client';
import { useModal } from '@/hooks/useModalStore';
import { cn } from '@/lib/utils';
import { User } from '@prisma/client';
import { CircleX, LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import MyAccount from '../profile/edit-profile/MyAccount';
import Profiles from '../profile/edit-profile/Profiles';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import FullScreenModal from './FullScreenModal';

const EDIT_PROFILE_NAVIGATION_ITEM_LABELS = [
  'My Account',
  'Profiles',
  'Billing',
] as const;

type TEditProfileNavigationItemLabel =
  (typeof EDIT_PROFILE_NAVIGATION_ITEM_LABELS)[number];

const EDIT_PROFILE_NAVIGATION_CATEGORY = [
  'USER SETTINGS',
  'BILLING SETTINGS',
  'APP SETTINGS',
] as const;

export type TEditProfileNavigationComponentProps = {
  user: User;
  goTo: (item: TEditProfileNavigationItemLabel) => void;
};

type TEditProfileNavigationCategory =
  (typeof EDIT_PROFILE_NAVIGATION_CATEGORY)[number];

type TEditProfileNavigationItem = {
  label: TEditProfileNavigationItemLabel;
  icon?: LucideIcon;
  component: React.FC<TEditProfileNavigationComponentProps>;
};

const EDIT_PROFILE_NAVIGATION: Record<
  TEditProfileNavigationCategory,
  TEditProfileNavigationItem[]
> = {
  'USER SETTINGS': [
    { label: 'My Account', component: MyAccount },
    { label: 'Profiles', component: Profiles },
  ],
  'BILLING SETTINGS': [
    {
      label: 'Billing',
      component: MyAccount,
    },
  ],
  'APP SETTINGS': [],
};

const EditProfileModal: React.FC = () => {
  const [selectedNavigationItem, setSelectedNavigationItem] =
    useState<TEditProfileNavigationItem>(
      EDIT_PROFILE_NAVIGATION['USER SETTINGS'][0]
    );

  const { closeModal, data } = useModal();

  const goTo = (item: TEditProfileNavigationItemLabel) => {
    setSelectedNavigationItem(
      Object.values(EDIT_PROFILE_NAVIGATION)
        .flat()
        .find((i) => i.label === item)!
    );
  };

  return (
    <FullScreenModal open onOpenChange={closeModal}>
      {data.user && (
        <div className="flex">
          <div className="flex flex-1">
            <div className="flex flex-auto h-screen bg-[#2b2d31] justify-end">
              <ScrollArea>
                <nav className="max-w-[200px] min-w-[200px] p-[60px_6px_60px_20px] mr-2">
                  <div className="flex flex-col">
                    <Input placeholder="Search" className="mb-5 h-8" />
                    {Object.entries(EDIT_PROFILE_NAVIGATION).map(
                      ([category, items]) =>
                        items.length > 0 && (
                          <div key={category}>
                            <h3 className="uppercase text-xs text-zinc-400 font-semibold px-2 mb-2">
                              {category}
                            </h3>
                            <div className="space-y-1">
                              {items.map((item, index) => (
                                <button
                                  key={index}
                                  className={cn(
                                    'flex items-center w-full px-[10px] py-[6px] rounded-md text-zinc-400 font-semibold transition-colors',
                                    selectedNavigationItem.label === item.label
                                      ? 'bg-[#404249] text-white'
                                      : 'hover:bg-[#35373c] hover:text-zinc-300'
                                  )}
                                  onClick={() =>
                                    setSelectedNavigationItem(item)
                                  }
                                >
                                  {item.label}
                                  {item.icon && (
                                    <item.icon className="ml-auto w-4 h-4" />
                                  )}
                                </button>
                              ))}
                            </div>
                            <Separator className="bg-zinc-700 my-4 w-11/12 mx-auto" />
                          </div>
                        )
                    )}
                  </div>
                </nav>
              </ScrollArea>
            </div>
          </div>
          <div className="flex flex-[1_1_800px] ">
            <div className="flex-1 h-screen bg-[#313338]">
              <ScrollArea className="h-screen">
                <div className="flex">
                  <div className="min-w-[460px] max-w-[740px] min-h-screen p-[60px_10px_80px_40px] flex-auto">
                    <selectedNavigationItem.component
                      user={data.user}
                      goTo={goTo}
                    />
                  </div>
                  <div className="relative flex-[0_0_36px] width-[60px] pt-[60px]">
                    <div className="fixed">
                      <CircleX
                        className="absolute flex-auto cursor-pointer"
                        onClick={() => {
                          closeModal();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </FullScreenModal>
  );
};

export default EditProfileModal;
