'use client';
import { useModal } from '@/hooks/useModalStore';
import { CircleX } from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import FullScreenModal from './FullScreenModal';

const EditProfileModal: React.FC = () => {
  const { isOpen, type, closeModal, data } = useModal();

  const open = isOpen && type === 'editProfile';

  return (
    <FullScreenModal open={open} onOpenChange={closeModal}>
      {data.user && (
        <div className="flex">
          <div className="flex flex-1">
            <div className="flex flex-auto h-screen bg-[#2b2d31] justify-end">
              <ScrollArea>
                <nav className="max-w-[200px] min-w-[200px] p-[60px_6px_60px_20px]">
                  <div className="flex flex-col space-y-3">
                    <h3 className="uppercase text-xs text-zinc-400">
                      User settings
                    </h3>
                    <div className="h-[2000px]">My Account</div>
                    <div>coucou</div>
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
                    <h2 className="text-2xl font-bold">Profiles</h2>
                    <div className="h-[2000px]">some content...</div>
                    <div>coucou je suis caché 😍</div>
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
