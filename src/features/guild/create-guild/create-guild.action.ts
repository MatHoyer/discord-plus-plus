'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { ProfileRole } from '@prisma/client';
import { flattenValidationErrors } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { v4 as uuid } from 'uuid';
import { createGuildSchema } from './create-guild.schema';

export const createGuild = authClient
  .schema(createGuildSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const session = await auth();
    const server = await prisma.guild.create({
      data: {
        ...parsedInput,
        ownerId: ctx.userId,
        inviteCode: uuid(),
        channels: {
          create: [{ name: 'general' }],
        },
        members: {
          create: [
            {
              userId: ctx.userId,
              nickname: session!.user.name!,
              image: session!.user.image!,
              role: ProfileRole.ADMIN,
            },
          ],
        },
      },
    });

    revalidatePath('/');

    return server;
  });
