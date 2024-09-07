'use client';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { useNotificationSound } from '@/hooks/usePingSound';
import { socket } from '@/socket';
import { Channel, Channeltype, ProfileRole } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ClientSocketEvents } from '../../../server/socket/client';
import GuildChannel from './GuildChannel';
import GuildSection from './GuildSection';

type TGuildChannelsProps = {
  guild: TGuildWithMembersAndProfiles;
  channels: {
    textChannels: Channel[];
    audioChannels: Channel[];
  };
  role: ProfileRole | undefined;
};

const GuildChannels: React.FC<TGuildChannelsProps> = ({
  guild,
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
        socket.on(`${key}:mention`, (mention: MentionWithUser) => {
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
          <GuildSection
            label="Text Channels"
            sectionType="channels"
            role={role}
            guild={guild}
          />
          {channels.TEXT.map((channel) => (
            <GuildChannel
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
          <GuildSection
            label="Audio Channels"
            sectionType="channels"
            role={role}
            guild={guild}
          />
          {channels.AUDIO.map((channel) => (
            <GuildChannel
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

export default GuildChannels;
