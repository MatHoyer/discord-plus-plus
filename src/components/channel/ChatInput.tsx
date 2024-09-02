'use client';
import { sendMessage } from '@/features/server/send-message/send-message.action';
import { SocketEvents } from '@/lib/socketUtils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { CirclePlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { Input } from '../ui/input';

const ChatInput: React.FC<{ channel: Channel }> = ({ channel }) => {
  const session = useSession();
  const [message, setMessage] = useState('');

  const { execute, isExecuting, result } = useAction(sendMessage, {
    onSuccess: (message) => {
      socket.emit(SocketEvents.NEW_MESSAGE, {
        message: message.data,
        channelId: channel.id,
      });
    },
  });

  return (
    <div className="flex items-center gap-2 rounded-lg p-1 bg-[#383a40] mx-5 mt-5">
      <CirclePlus size={30} className="ml-2 cursor-pointer" />
      <Input
        className="border-none bg-inherit focus-visible:ring-0 focus-visible:ring-offset-0 select-none "
        placeholder={`Envoyer un message dans #${channel.name}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && message.length > 0) {
            execute({
              message,
              channelId: channel.id,
              senderId: session.data!.user.id,
            });
            setMessage('');
          }
        }}
      />
    </div>
  );
};

export default ChatInput;
