import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import prisma from './prisma';

export const { auth, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    session: ({ user, session }) => {
      return { ...session, user };
    },
  },
});
