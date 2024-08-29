'use client';

import { SocketEvents } from '@/lib/socketUtils';
import { socket } from '@/socket';
import { useEffect } from 'react';

const SocketLayout = (props: LayoutParams) => {
  useEffect(() => {
    socket.emit(SocketEvents.PING, 'home');
    socket.on(SocketEvents.PONG, (data) => {
      console.log(SocketEvents.PONG, data);
    });

    return () => {
      socket.off(SocketEvents.PONG);
    };
  }, []);

  return <div>{props.children}</div>;
};

export default SocketLayout;
