import ChatInput from '@/components/ChatInput';
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
      {props.children}
      {channel.type === 'TEXT' && <ChatInput channel={channel.name} />}
    </div>
  );
};

export default ChannelLayout;
