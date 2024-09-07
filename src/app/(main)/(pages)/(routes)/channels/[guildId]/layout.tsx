import GuildSidebar from '@/components/guild/GuildSidebar';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const guildParamsSchema = z.object({
  guildId: z.coerce.number().positive(),
});

const GuildLayout = async (props: LayoutParams<{ guildId: string }>) => {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const result = guildParamsSchema.safeParse(props.params);

  if (!result.success) {
    return notFound();
  }

  const { guildId } = result.data;

  const guild = await prisma.guild.findUnique({
    where: {
      id: guildId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!guild) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <GuildSidebar guildId={guildId} />
      </div>
      <main className="h-full md:pl-60">{props.children}</main>
    </div>
  );
};

export default GuildLayout;
