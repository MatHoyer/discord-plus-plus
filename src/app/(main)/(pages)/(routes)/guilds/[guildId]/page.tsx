import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

const ServerPage = async (props: PageParams<{ guildId: string }>) => {
  const channel = await prisma.channel.findFirst({
    where: {
      name: 'general',
      guildId: +props.params.guildId,
    },
  });

  if (channel)
    return redirect(`/guilds/${props.params.guildId}/channels/${channel.id}`);

  redirect('/');
};

export default ServerPage;
