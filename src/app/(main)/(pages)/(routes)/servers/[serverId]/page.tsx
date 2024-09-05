import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

const ServerPage = async (props: PageParams<{ serverId: string }>) => {
  const channel = await prisma.channel.findFirst({
    where: {
      name: 'general',
      serverId: +props.params.serverId,
    },
  });

  if (channel)
    redirect(`/servers/${props.params.serverId}/channels/${channel.id}`);
  else redirect('/');
};

export default ServerPage;
