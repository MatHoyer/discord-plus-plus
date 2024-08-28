'use client';

import { SocketEvents } from '@/lib/socketUtils';
import { socket } from '@/socket';
import { useEffect } from 'react';

const SocketLayout = (props: LayoutParams) => {
  useEffect(() => {
    socket.emit(SocketEvents.PING, 'home');
    socket.on(SocketEvents.PONG, (data) => {
      console.log('pong', data);
    });

    return () => {
      socket.off('pong');
    };
  }, []);

  return <div>{props.children}</div>;
};

export default SocketLayout;
