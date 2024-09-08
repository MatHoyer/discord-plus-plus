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

  const existingServer = await prisma.guild.findUnique({
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
    return redirect(`/channels/${existingServer.id}`);
  }

  const server = await prisma.guild.update({
    where: {
      inviteCode: result.data,
    },
    data: {
      members: {
        create: [
          {
            nickname: session.user.name!,
            image: session.user.image!,
            userId: session.user.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/channels/${server.id}`);
  }
};

export default InvitePage;
