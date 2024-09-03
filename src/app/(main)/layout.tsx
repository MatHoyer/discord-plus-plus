'use client';
import { socket } from '@/socket';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const SocketLayout = (props: LayoutParams) => {
  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      socket.emit('init', { userId: session.data.user.id });
    }
  }, [session]);

  return <div className="h-screen">{props.children}</div>;
};

export default SocketLayout;
