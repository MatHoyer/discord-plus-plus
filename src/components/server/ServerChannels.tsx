'use client';
import { socket } from '@/socket';
import { Channel, Channeltype, MemberRole } from '@prisma/client';
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
  const [channels, setChannels] = useState({
    [Channeltype.TEXT]: textChannels,
    [Channeltype.AUDIO]: audioChannels,
  });
  const [unreadChannels, setUnreadChannels] = useState<Set<number>>(new Set());
  const params = useParams();

  useEffect(() => {
    socket.on('new-channel', (channel: Channel) => {
      setChannels((prev) => ({
        ...prev,
        [channel.type]: [...prev[channel.type], channel],
      }));
    });

    socket.on('delete-channel', (channel: Channel) => {
      setChannels((prev) => ({
        ...prev,
        [channel.type]: prev[channel.type].filter((c) => c.id !== channel.id),
      }));
    });

    return () => {
      socket.off('new-channel');
      socket.off('delete-channel');
    };
  }, []);

  useEffect(() => {
    const textChannels = channels.TEXT;

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
  }, [channels]);

  return (
    <>
      {!!channels.TEXT?.length && (
        <div className="mb-2">
          <ServerSection
            label="Text Channels"
            sectionType="channels"
            channelType="TEXT"
            role={role}
            server={server}
          />
          {channels.TEXT.map((channel) => (
            <ServerChannel
              key={channel.id}
              {...{ channel, role }}
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
      {!!channels.AUDIO?.length && (
        <div className="mb-2">
          <ServerSection
            label="Audio Channels"
            sectionType="channels"
            channelType="AUDIO"
            role={role}
            server={server}
          />
          {channels.AUDIO.map((channel) => (
            <ServerChannel key={channel.id} {...{ channel, role }} />
          ))}
        </div>
      )}
    </>
  );
};

export default ServerChannels;
