import ChatInput from '@/components/ChatInput';
import Message from '@/components/Message';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const channelParamsSchema = z.object({
  serverId: z.coerce.number().positive(),
  channelId: z.coerce.number().positive(),
});

const ChannelLayout = async (
  props: LayoutParams<{ serverId: string; channelId: string }>
) => {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const result = channelParamsSchema.safeParse(props.params);

  if (!result.success) {
    return notFound();
  }

  const { channelId } = result.data;

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
      serverId: result.data.serverId,
    },
  });

  if (!channel) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <div className="h-[5%] flex items-center pl-5">{props.children}</div>
      {channel.type === 'TEXT' && (
        <>
          <div className="h-[85%] overflow-y-scroll flex flex-col justify-end">
            <Message
              username="MatMat"
              message="Hello World!"
              time={'Today 10:00'}
            />
          </div>
          <ChatInput channel={{ ...channel }} />
        </>
      )}
    </div>
  );
};

export default ChannelLayout;
