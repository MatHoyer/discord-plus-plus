'use server';

import prisma from '@/lib/prisma';
import { authClient } from '@/lib/safe-action';
import { MemberRole } from '@prisma/client';
import { flattenValidationErrors } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { v4 as uuid } from 'uuid';
import { createServerSchema } from './create-server.schema';

export const createServer = authClient
  .schema(createServerSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput, ctx }) => {
    const server = await prisma.server.create({
      data: {
        ...parsedInput,
        userId: ctx.userId,
        inviteCode: uuid(),
        channels: {
          create: [{ name: 'general' }],
        },
        members: {
          create: [{ userId: ctx.userId, role: MemberRole.ADMIN }],
        },
      },
    });

    revalidatePath('/');

    return server;
  });
