'use client';

import { useModal } from '@/hooks/useModalStore';
import { getCustomDate } from '@/lib/utils';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import UserAvatar from '../UserAvatar';

const MemberProfileModal: React.FC = () => {
  const { isOpen, type, closeModal, data } = useModal();

  const open = isOpen && type === 'memberProfile';

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="p-0 overflow-hidden pb-4"
        showClose={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only" />
        {data.member && (
          <div>
            <div className="relative w-full h-36 rounded-lg">
              <Image
                src="https://wallpapers.com/images/featured/beautiful-background-td7gsxerv3ecl20h.jpg"
                width="1000"
                height="1000"
                alt="Background"
                className="w-full h-full object-cover filter absolute"
              />
              <div className="absolute flex items-end justify-between h-full p-4">
                <div className="absolute -bottom-9 z-10">
                  <UserAvatar
                    src={data.member.user?.image}
                    className="md:w-20 md:h-20"
                  />
                  <div className="absolute bottom-0 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="min-h-[100px] pt-12 px-4">
              <div className="flex flex-col">
                <div className="font-bold">{data.member.username}</div>
                <span className="text-xs">{data.member.user.name}</span>
              </div>
              <div className="p-2 mt-4 border border-[#353c47] rounded-md">
                <div>
                  <div className="text-xs">Member Since</div>
                  <div className="text-xs flex items-center gap-1">
                    {getCustomDate(data.member.user.createdAt)}
                    <div className="w-1 h-1 bg-white rounded-full" />
                    {getCustomDate(data.member.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemberProfileModal;
