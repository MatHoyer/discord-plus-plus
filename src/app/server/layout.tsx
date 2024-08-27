import ChannelList from '@/components/channel/ChannelList';
import ChatInput from '@/components/ChatInput';
import ServerList from '@/components/server/ServerList';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { LayoutParams } from '../../../globals';

const ServerLayout = async (props: LayoutParams) => {
  const session = await auth();

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          userId: session?.user.id,
        },
      },
    },
  });

  return (
    <section className="h-screen w-screen layout">
      <ServerList servers={servers} />
      <ChannelList />
      <div className="flex flex-col gap-10 p-3">
        {props.children}
        <ChatInput channel="test" />
      </div>
    </section>
  );
};

export default ServerLayout;
