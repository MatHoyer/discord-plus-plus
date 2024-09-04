import ChannelMembersSidebar from '@/components/channel/ChannelMembersSidebar';
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

  const { channelId, serverId } = result.data;

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
      serverId: serverId,
    },
  });

  if (!channel) {
    return redirect('/');
  }

  return (
    <>
      <div className="bg-white w-full md:w-[calc(100%-15rem)] dark:bg-[#313338] flex flex-col h-full">
        {props.children}
      </div>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed right-0 inset-y-0">
        <ChannelMembersSidebar serverId={serverId} channelId={channelId} />
      </div>
    </>
  );
};

export default ChannelLayout;
