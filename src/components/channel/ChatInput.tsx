'use client';
import { sendMessage } from '@/features/server/channel/send-message/send-message.action';
import { SocketEvents } from '@/lib/socketUtils';
import { socket } from '@/socket';
import { Channel } from '@prisma/client';
import { Plus, Smile } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { Input } from '../ui/input';

const ChatInput: React.FC<{ channel: Channel }> = ({ channel }) => {
  const session = useSession();
  const [message, setMessage] = useState('');

  const { execute } = useAction(sendMessage, {
    onSuccess: (message) => {
      socket.emit(SocketEvents.NEW_MESSAGE, {
        message: message.data,
        channelId: channel.id,
      });
    },
  });

  return (
    <div className="relative p-4 pb-6">
      <button className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition-colors rounded-full p-1 flex items-center justify-center">
        <Plus className="cursor-pointer text-white dark:text-[#313338]" />
      </button>
      <Input
        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
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
      <div className="absolute top-7 right-8">
        <Smile className="cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatInput;
