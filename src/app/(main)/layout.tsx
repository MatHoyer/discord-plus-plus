'use client';
import { useActivity } from '@/hooks/useActivityStore';
import { socket } from '@/socket';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const SocketLayout = (props: LayoutParams) => {
  const session = useSession();
  const changeActivity = useActivity((state) => state.changeActivity);

  useEffect(() => {
    if (session.data?.user) {
      socket.emit('init', { userId: session.data.user.id });
    }

    socket.on('init-activity', (usersActivity) => {
      for (const { userId, activity } of usersActivity) {
        changeActivity(userId, activity);
      }
    });

    socket.on('activity-change', ({ userId, activity }) => {
      changeActivity(userId, activity);
    });

    return () => {
      socket.off('init-activity');
      socket.off('activity-change');
    };
  }, []);

  return <div className="h-screen">{props.children}</div>;
};

export default SocketLayout;
