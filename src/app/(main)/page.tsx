'use client';

import { socket } from '@/socket';
import { useEffect } from 'react';

const MainPage = () => {
  useEffect(() => {
    socket.connected && socket.emit('ping', 'Hello, server!');

    socket.on('pong', (data) => {
      console.log('pong', data);
    });

    return () => {
      socket.off('pong');
    };
  }, []);

  return <div>PAGE</div>;
};

export default MainPage;
