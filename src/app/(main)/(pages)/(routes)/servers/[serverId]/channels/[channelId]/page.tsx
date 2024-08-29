'use server';

import ChatInput from '@/components/ChatInput';
import Message from '@/components/Message';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getCustomDate } from '@/lib/utils';
import { redirect } from 'next/navigation';

const ServerPage = async (
  props: PageParams<{ serverId: string; channelId: string }>
) => {
  const session = await auth();

  const channel = await prisma.channel.findUnique({
    where: {
      id: +props.params.channelId,
      serverId: +props.params.serverId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!channel || !session) {
    return redirect('/');
  }

  return (
    <>
      <div className="h-[5%] flex items-center pl-5">
        Server: {props.params.serverId}, Channel: {props.params.channelId}
      </div>
      {channel.type === 'TEXT' && (
        <>
          <div className="h-[85%] overflow-y-scroll flex flex-col justify-end">
            {channel.messages.map((message) => (
              <Message
                key={message.id}
                username={message.sender?.user.name || 'Deleted User'}
                message={message.content}
                time={getCustomDate(message.createdAt)}
              />
            ))}
          </div>
          <ChatInput channel={channel} senderId={session.user.id} />
        </>
      )}
    </>
  );
};

export default ServerPage;
