import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const inviteCodeSchema = z.string().uuid();

const InvitePage = async (props: PageParams<{ inviteCode: string }>) => {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const { inviteCode } = props.params;

  const result = inviteCodeSchema.safeParse(inviteCode);

  if (!result.success) {
    return redirect('/');
  }

  const existingServer = await prisma.server.findUnique({
    where: {
      inviteCode: result.data,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await prisma.server.update({
    where: {
      inviteCode: result.data,
    },
    data: {
      members: {
        create: [
          {
            userId: session.user.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
};

export default InvitePage;
