'use client';

import {
  loadMoreMessages,
  loadMoreMessagesAround,
} from '@/features/guild/channel/message/load-more-messages';
import { useGlobalStore } from '@/hooks/useGlobalStore';
import { getCustomDate } from '@/lib/utils';
import { socket } from '@/socket';
import { User } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { getChannelSocketEvents } from '../../../server/socket/channel';
import ChannelMessage from './channel-message/ChannelMessage';

const ScrollableChat: React.FC<{
  channel: ChannelWithMessages;
  currentMember: MemberWithUser;
  members: MemberWithUser[];
  user: User;
}> = ({ channel, currentMember, members, user }) => {
  const [messages, setMessages] = useState<MessageWithSender[]>(
    channel.messages
  );
  const setFlashReferencedMessageId = useGlobalStore(
    (state) => state.setFlashReferencedMessageId
  );

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<number>(0);

  useEffect(() => {
    const channelSocketEvents = getChannelSocketEvents(channel.id);

    socket.on(channelSocketEvents.newMessage, (message: MessageWithSender) => {
      setMessages((prev) => [message, ...prev]);
    });

    socket.on(channelSocketEvents.editMessage, (message: MessageWithSender) => {
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === message.id);
        if (index === -1) {
          return prev;
        }
        const newMessages = [...prev];
        newMessages[index] = message;
        return newMessages;
      });
    });

    socket.on(
      channelSocketEvents.reactedToMessage,
      (reaction: MessageReactionWithMembers) => {
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

    socket.on(channelSocketEvents.deleteAttachment, (attachmentId: number) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        for (const message of newMessages) {
          if (message.attachments) {
            message.attachments = message.attachments.filter(
              (attachment) => attachment.id !== attachmentId
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
      socket.off(channelSocketEvents.deleteAttachment);
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

  const scrollToMessage = (messageId: number) => {
    const element = document.querySelector(`[data-message-id='${messageId}']`);
    if (element) {
      setFlashReferencedMessageId(messageId);
      element.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
    return undefined;
  };

  const onReferencedMessageClicked = async (
    referencedMessage: MessageWithSender
  ) => {
    if (!scrollToMessage(referencedMessage.id)) {
      const aroundMessages = await loadMoreMessagesAround(
        channel.id,
        referencedMessage.id
      );
      const filteredAroundMessages = aroundMessages.filter(
        (m) => !messages.some((msg) => msg.id === m.id)
      );

      setMessages((prev) => [...prev, ...filteredAroundMessages]);

      setTimeout(() => {
        scrollToMessage(referencedMessage.id);
      }, 100);
    }
  };

  return (
    <div className="flex-1 overflow-y-scroll overflow-x-hidden flex flex-col-reverse">
      <div ref={bottomRef} className="p-1" />
      {messages.map((message, index) => (
        <ChannelMessage
          key={message.id}
          message={message}
          previousMessage={messages[index + 1]}
          nextMessage={messages[index - 1]}
          currentMember={currentMember}
          time={getCustomDate(new Date(message.createdAt))}
          channel={channel}
          members={members}
          onReferencedMessageClicked={onReferencedMessageClicked}
        />
      ))}
      <div ref={topRef} className="p-1" />
    </div>
  );
};

export default ScrollableChat;
