import { Prisma } from '@prisma/client';
import { createSafeActionClient } from 'next-safe-action';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { auth } from './auth';

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  clientInput: Record<string | number, unknown>
) => {
  switch (err.code) {
    case 'P2002':
      const fields = (err.meta?.target as string[])
        .filter((field) => !field.toLowerCase().includes('id'))
        .map((field) =>
          clientInput?.[field]
            ? `'${field}: ${clientInput[field]}'`
            : `'${field}'`
        )
        .join(', ');

      return `A record with ${fields} already exists.`;
    default:
      return err.message;
  }
};

export const errorHandler = (
  err: unknown,
  clientInput: Record<string | number, unknown>
) => {
  if (isRedirectError(err)) {
    throw err;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/orm/reference/error-reference
    return handlePrismaError(err, clientInput);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return err.message;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return 'An error occurred';
};

export const baseClient = createSafeActionClient({
  handleReturnedServerError: (err, utils) =>
    errorHandler(err, utils.clientInput as Record<string | number, unknown>),
});

export const authClient = baseClient.use(async ({ next }) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return next({
    ctx: {
      userId: session.user.id,
    },
  });
});
