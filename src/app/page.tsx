import ChannelList from '@/components/channel/ChannelList';
import ChatInput from '@/components/ChatInput';
import ServerList from '@/components/server/ServerList';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

const Home = async () => {
  const session = await auth();

  // if (!session?.user) {
  //   return <div>loading...</div>;
  // }

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          id: session?.user.id,
        },
      },
    },
  });

  return (
    <section className="h-screen w-screen layout">
      <ServerList servers={servers} />
      <ChannelList />
      <div className="flex flex-col gap-10 p-3">
        <ChatInput channel="test" />
      </div>
    </section>
  );
};

export default Home;
