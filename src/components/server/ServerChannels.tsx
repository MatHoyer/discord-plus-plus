'use client';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useNotificationSound } from '@/hooks/usePingSound';
import { socket } from '@/socket';
import { Channel, Channeltype, MemberRole } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ClientSocketEvents } from '../../../server/socket/client';
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
  const {
    setAsRead,
    unreadChannels,
    setUnreadChannels,
    channelMentions,
    addChannelMention,
  } = useGlobalStore();

  const [channels, setChannels] = useState({
    [Channeltype.TEXT]: textChannels,
    [Channeltype.AUDIO]: audioChannels,
  });
  const play = useNotificationSound();
  const params = useParams();

  useEffect(() => {
    socket.on(ClientSocketEvents.newChannel, (channel: Channel) => {
      setChannels((prev) => ({
        ...prev,
        [channel.type]: [...prev[channel.type], channel],
      }));
    });

    socket.on(ClientSocketEvents.editChannel, (channel: Channel) => {
      setChannels((prev) => ({
        ...prev,
        [channel.type]: prev[channel.type].map((c) =>
          c.id === channel.id ? channel : c
        ),
      }));
    });

    socket.on(ClientSocketEvents.deleteChannel, (channel: Channel) => {
      setChannels((prev) => ({
        ...prev,
        [channel.type]: prev[channel.type].filter((c) => c.id !== channel.id),
      }));
    });

    return () => {
      socket.off(ClientSocketEvents.newChannel);
      socket.off(ClientSocketEvents.editChannel);
      socket.off(ClientSocketEvents.deleteChannel);
    };
  }, []);

  useEffect(() => {
    const textChannels = channels.TEXT;
    for (const channel of textChannels) {
      const key = `channel:${channel.id}`;
      if (channel.id !== +params.channelId) {
        socket.on(`${key}:new-message`, () => {
          setUnreadChannels(channel.id);
        });
        socket.on(`${key}:mention`, (mention: ServerMentionWithUser) => {
          addChannelMention(channel.id, mention);
          play();
        });
      }
    }

    return () => {
      for (const channel of textChannels) {
        const key = `channel:${channel.id}`;
        if (channel.id !== +params.channelId) {
          socket.off(`${key}:new-message`);
          socket.off(`${key}:mention`);
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
              isUnread={
                [...unreadChannels].includes(channel.id) ||
                channelMentions[channel.id]?.length > 0
              }
              onClick={setAsRead}
              mentions={channelMentions[channel.id]?.length ?? 0}
              {...{ channel, role }}
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
            <ServerChannel
              key={channel.id}
              {...{ channel, role }}
              mentions={0}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ServerChannels;
