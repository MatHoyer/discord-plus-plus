import ServerSidebar from '@/components/server/ServerSidebar';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

const serverParamsSchema = z.object({
  serverId: z.coerce.number().positive(),
});

const ServerLayout = async (props: LayoutParams<{ serverId: string }>) => {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const result = serverParamsSchema.safeParse(props.params);

  if (!result.success) {
    return notFound();
  }

  const { serverId } = result.data;

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60 dark:bg-[#313338]">
        {props.children}
      </main>
    </div>
  );
};

export default ServerLayout;
