'use client';

import { useActivity } from '@/hooks/useActivityStore';
import { User, UserGuildProfile } from '@prisma/client';
import { Headphones, LucideProps, Mic, Settings } from 'lucide-react';
import { Activity } from '../../../server/User';
import ChannelMemberProfileWithActivity from '../channel/ChannelMemberProfileWithActivity';

const IconContainer: React.FC<{ Icon: React.ComponentType<LucideProps> }> = ({
  Icon,
}) => {
  return (
    <div className="hover:bg-[#35373c] transition-colors rounded-md p-2 cursor-pointer group">
      <Icon className="text-zinc-400 group-hover:animate-spin group-hover:text-zinc-200 transition-colors h-5 w-5" />
    </div>
  );
};

type TSideBarProfileProps = {
  user: User;
  currentMember?: UserGuildProfile;
};

const SideBarProfile: React.FC<TSideBarProfileProps> = ({
  user,
  currentMember,
}) => {
  const users = useActivity((state) => state.users);

  return (
    <div className="w-full p-2 flex items-center bg-[#232428]">
      <div className="max-w-[50%]">
        <ChannelMemberProfileWithActivity
          user={user}
          member={currentMember}
          isSideBar
        >
          <div className="truncate text-xs text-zinc-400">
            {Activity[users[user.id]]}
          </div>
        </ChannelMemberProfileWithActivity>
      </div>
      <div className="flex justify-evenly w-full">
        <IconContainer Icon={Mic} />
        <IconContainer Icon={Headphones} />
        <IconContainer Icon={Settings} />
      </div>
    </div>
  );
};

export default SideBarProfile;
