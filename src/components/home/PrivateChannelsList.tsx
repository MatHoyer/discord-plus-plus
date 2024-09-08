'use client';
import { Handshake, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import HomeUserWithActivity from './HomeUserWithActivity';

type HomeButtonProps = {
  friendId?: number;
  isClosable?: boolean;
  onClick?: () => void;
} & PropsWithChildren;

const HomeButton: React.FC<HomeButtonProps> = ({
  isClosable = false,
  children,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center bg-inherit hover:bg-[#404249] text-zinc-400 hover:text-zinc-300 transition-colors font-semibold rounded-md p-3 cursor-pointer group"
    >
      <div className="flex-1 flex gap-2">{children}</div>
      {isClosable && (
        <X
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 hover:text-zinc-100 hidden group-hover:flex"
        />
      )}
    </div>
  );
};

const PrivateChannelsList: React.FC<{
  privateChannels: ChannelWithParticipants[];
}> = ({ privateChannels }) => {
  const router = useRouter();
  const user = useSession().data?.user;

  return (
    <ScrollArea className="flex-1 px-3">
      <HomeButton onClick={() => router.push('/channels/me')}>
        <Handshake />
        <p>Friends</p>
      </HomeButton>
      {user &&
        privateChannels.map((pChannel, i) => {
          const friend =
            pChannel.participants.find((p) => p.id !== user.id) || user; //TODO
          return (
            <HomeButton
              key={i}
              onClick={() => router.push(`/channels/me/${pChannel.id}`)}
              isClosable
            >
              <HomeUserWithActivity user={friend} />
            </HomeButton>
          );
        })}
    </ScrollArea>
  );
};

export default PrivateChannelsList;
