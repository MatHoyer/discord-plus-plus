'use client';

import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';

export const LoginButton = () => {
  return (
    <Button onClick={() => signIn('github')}>
      <LogIn />
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button variant={'destructive'} onClick={() => signOut()}>
      <LogOut />
    </Button>
  );
};
