'use client';

import { loadMoreMessages } from '@/features/server/channel/message/load-more-messages';
import { getCustomDate } from '@/lib/utils';
import { socket } from '@/socket';
import { useEffect, useRef, useState } from 'react';
import { getChannelSocketEvents } from '../../../server/socket/channel';
import ChannelMessage from './ChannelMessage';

const ScrollableChat: React.FC<{
  channel: ChannelWithMessages;
  currentMember: MemberWithUser;
  members: MemberWithUser[];
}> = ({ channel, currentMember, members }) => {
  const [messages, setMessages] = useState<ServerMessageWithSender[]>(
    channel.messages
  );

  const topRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<number>(0);

  useEffect(() => {
    const channelSocketEvents = getChannelSocketEvents(channel.id);

    socket.on(
      channelSocketEvents.newMessage,
      (message: ServerMessageWithSender) => {
        setMessages((prev) => [message, ...prev]);
      }
    );

    socket.on(
      channelSocketEvents.editMessage,
      (message: ServerMessageWithSender) => {
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === message.id);
          if (index === -1) {
            return prev;
          }
          const newMessages = [...prev];
          newMessages[index] = message;
          return newMessages;
        });
      }
    );

    socket.on(
      channelSocketEvents.reactedToMessage,
      (reaction: ServerMessageReactionWithMembers) => {
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === reaction.messageId);
          if (index === -1) {
            return prev;
          }
          const newMessages = [...prev];
          const message = newMessages[index];

          if (message.reactions) {
            const reactionIndex = message.reactions.findIndex(
              (r) => r.id === reaction.id
            );
            if (reactionIndex !== -1) {
              message.reactions[reactionIndex] = reaction;
            } else {
              message.reactions.push(reaction);
            }
          } else {
            message.reactions = [reaction];
          }
          return newMessages;
        });
      }
    );

    socket.on(channelSocketEvents.deleteReaction, (reactionId: number) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        for (const message of newMessages) {
          if (message.reactions) {
            message.reactions = message.reactions.filter(
              (reaction) => reaction.id !== reactionId
            );
          }
        }
        return newMessages;
      });
    });

    socket.on(channelSocketEvents.deleteMessage, (messageId: number) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    return () => {
      socket.off(channelSocketEvents.newMessage);
      socket.off(channelSocketEvents.editMessage);
      socket.off(channelSocketEvents.reactedToMessage);
      socket.off(channelSocketEvents.deleteReaction);
      socket.off(channelSocketEvents.deleteMessage);
    };
  }, [channel.id]);

  useEffect(() => {
    const ref = topRef.current;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && messages.length !== countRef.current) {
          const { messages: newMessages, messagesCount } =
            await loadMoreMessages(channel.id, messages.length);
          countRef.current = messagesCount;
          setMessages((prev) => [...prev, ...newMessages]);
        }
      },
      { threshold: 0.01 }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [channel.id, messages.length]);

  return (
    <div className="flex-1 overflow-y-scroll flex flex-col-reverse gap-2">
      {messages.map((message) => (
        <ChannelMessage
          key={message.id}
          message={message}
          currentMember={currentMember}
          time={getCustomDate(new Date(message.createdAt))}
          channel={channel}
          members={members}
        />
      ))}
      <div ref={topRef} className="p-1" />
    </div>
  );
};

export default ScrollableChat;
