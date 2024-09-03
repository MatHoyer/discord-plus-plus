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
  const [channelMentions, setChannelMentions] = useState<
    Record<number, ServerMentionWithUser[]>
  >({});
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

    socket.on('edit-channel', (channel: Channel) => {
      setChannels((prev) => ({
        ...prev,
        [channel.type]: prev[channel.type].map((c) =>
          c.id === channel.id ? channel : c
        ),
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
      socket.off('edit-channel');
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
      socket.on(
        `channel:${channel.id}:mention`,
        (mention: ServerMentionWithUser) => {
          const mentions = [...(channelMentions[channel.id] ?? []), mention];
          const uniqueMentionsById = mentions.filter(
            (m, i) => mentions.findIndex((m2) => m2.id === m.id) === i
          );
          setChannelMentions((prev) => ({
            ...prev,
            [channel.id]: uniqueMentionsById,
          }));
        }
      );
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
              onClick={() => {
                setUnreadChannels((prev) => {
                  prev.delete(channel.id);
                  return new Set(prev);
                });
                setChannelMentions((prev) => ({
                  ...prev,
                  [channel.id]: [],
                }));
              }}
              mentions={channelMentions[channel.id]?.length ?? 0}
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
