'use client';

import { useActivity } from '@/hooks/useActivityStore';
import { useModal } from '@/hooks/useModalStore';
import { getCustomDate } from '@/lib/utils';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import UserAvatarWithActivity from '../UserAvatarWithActivity';

const MemberProfileModal: React.FC = () => {
  const { isOpen, type, closeModal, data } = useModal();
  const usersActivity = useActivity((state) => state.users);
  const open = isOpen && type === 'memberProfile';

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent
        className="p-0 overflow-hidden pb-4 bg-[#12202a]"
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
                <UserAvatarWithActivity
                  size="xl"
                  wrapperClassName="absolute -bottom-9 z-10"
                  avatarClassName='className="md:w-20 md:h-20'
                  activity={usersActivity[data.member.userId] ?? 'Offline'}
                  src={data.member.user?.image}
                  activityIndicator={{
                    size: 'xl',
                  }}
                />
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
                    {getCustomDate(new Date(data.member.user.createdAt))}
                    <div className="w-1 h-1 bg-white rounded-full" />
                    {getCustomDate(new Date(data.member.createdAt))}
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
