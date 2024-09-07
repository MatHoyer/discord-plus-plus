'use client';
import { useModal } from '@/hooks/useModalStore';
import { CircleX } from 'lucide-react';
import React from 'react';
import FullScreenModal from './FullScreenModal';

const EditProfileModal: React.FC = () => {
  const { isOpen, type, closeModal, data } = useModal();

  const open = isOpen && type === 'editProfile';

  return (
    <FullScreenModal open={open} onOpenChange={closeModal}>
      {data.currentMember ? (
        <div className="flex">
          <div className="flex flex-1 justify-end">
            <div className="items-end p-3 bg-red-500">left</div>
          </div>
          <div className="flex flex-[1_1_800px] ">
            <div className="flex-1 h-screen bg-blue-500">
              <div
                className="pr-0 justify-start h-screen static flex items-start"
                style={{
                  overflow: 'hidden scroll',
                }}
              >
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
            </div>
          </div>
        </div>
      ) : null}
    </FullScreenModal>
  );
};

export default EditProfileModal;
