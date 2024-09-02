'use client';
import { socket } from '@/socket';
import { Channel, MemberRole } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ServerChannel from './ServerChannel';
import ServerSection from './ServerSection';

type TServerChannelsProps = {
  server: TServerWithMembersAndProfiles;
  channels: {
    textChannels: Channel[];
    audioChannels: Channel[];
  };
  role: MemberRole | undefined;
};

const ServerChannels: React.FC<TServerChannelsProps> = ({
  server,
  channels: { textChannels, audioChannels },
  role,
}) => {
  const [unreadChannels, setUnreadChannels] = useState<Set<number>>(new Set());
  const params = useParams();

  useEffect(() => {
    for (const channel of textChannels) {
      if (channel.id !== +params.channelId) {
        socket.on(`channel:${channel.id}:new-message`, () => {
          setUnreadChannels((prev) => new Set([...prev, channel.id]));
        });
      }
    }

    return () => {
      for (const channel of textChannels) {
        if (channel.id !== +params.channelId) {
          socket.off(`channel:${channel.id}:new-message`);
        }
      }
    };
  }, [server]);

  return (
    <>
      {!!textChannels?.length && (
        <div className="mb-2">
          <ServerSection
            label="Text Channels"
            sectionType="channels"
            channelType="TEXT"
            role={role}
            server={server}
          />
          {textChannels.map((channel) => (
            <ServerChannel
              key={channel.id}
              {...{ channel, server, role }}
              isUnread={[...unreadChannels].includes(channel.id)}
              setAsRead={() => {
                setUnreadChannels((prev) => {
                  prev.delete(channel.id);
                  return new Set(prev);
                });
              }}
            />
          ))}
        </div>
      )}
      {!!audioChannels?.length && (
        <div className="mb-2">
          <ServerSection
            label="Audio Channels"
            sectionType="channels"
            channelType="AUDIO"
            role={role}
            server={server}
          />
          {audioChannels.map((channel) => (
            <ServerChannel key={channel.id} {...{ channel, server, role }} />
          ))}
        </div>
      )}
    </>
  );
};

export default ServerChannels;
