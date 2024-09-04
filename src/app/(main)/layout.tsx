'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { socket } from '@/socket';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import {
  ClientSocketEvents,
  ServerSocketEvents,
} from '../../../server/socket/events';

const SocketLayout = (props: LayoutParams) => {
  const session = useSession();
  const changeActivity = useActivity((state) => state.changeActivity);

  useEffect(() => {
    if (session.data?.user.id) {
      socket.emit(ServerSocketEvents.init, { userId: session.data.user.id });
    }

    socket.on(ClientSocketEvents.initActivity, (usersActivity) => {
      for (const { userId, activity } of usersActivity) {
        changeActivity(userId, activity);
      }
    });

    socket.on(ClientSocketEvents.activityChange, ({ userId, activity }) => {
      changeActivity(userId, activity);
    });

    return () => {
      socket.off(ClientSocketEvents.initActivity);
      socket.off(ClientSocketEvents.activityChange);
    };
  }, [session.data?.user.id]);

  return <div className="h-screen">{props.children}</div>;
};

export default SocketLayout;
