import { createServer } from 'http';
import next from 'next';
import { Server, Socket } from 'socket.io';
import { User } from './User.ts';
import { UserManager } from './UserManager.ts';

const dev = process.env.NODE_ENV !== 'production';

const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const userManager = new UserManager();

  const yellow = '\x1b[33mSOCKET: ';
  const bold = '\x1b[1m';
  const reset = '\x1b[0m';

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const socketMiddleware = (
    socket: Socket,
    eventHandlers: Record<string, (...args: any) => void>
  ) => {
    for (const [event, handler] of Object.entries(eventHandlers)) {
      socket.on(event, (...args) => {
        if (event !== 'disconnect')
          console.log(`${yellow}${event} event triggered${reset}`);
        handler(...args);
      });
    }
  };

  io.on('connection', (socket) => {
    console.log(`${bold}${yellow}user connected${reset}`);

    socketMiddleware(socket, {
      init: ({ userId }) => {
        const user = new User(userId, socket);
        userManager.addUser(user);
      },
      disconnect: () => {
        console.log(`${bold}${yellow}user disconnected${reset}`);
        userManager.removeUserBySocketId(socket.id);
      },
      'new-message': ({ channelId, message }) => {
        io.emit(`channel:${channelId}:new-message`, message);
      },
      'edit-message': (data) => {
        io.emit(`channel:${data.channelId}:edit-message`, data);
      },
      mention: ({ channelId, mentions }) => {
        for (const mention of mentions) {
          const user = userManager.getUserById(mention.member.userId);
          if (!user) continue;
          if (user.socket) {
            user.socket.emit(`channel:${channelId}:mention`, mention);
          }
        }
      },
      'delete-message': ({ channelId, messageId }) => {
        io.emit(`channel:${channelId}:delete-message`, messageId);
      },
      'change-activity': ({ activity }) => {
        userManager.changeUserActivity(socket.id, activity);
        const user = userManager.getUserBySocketId(socket.id);
        if (!user) return;
        io.emit('activity-change', {
          userId: user!.id,
          activity,
        });
      },
      'new-channel': (channel) => {
        io.emit('new-channel', channel);
      },
      'edit-channel': (channel) => {
        io.emit('edit-channel', channel);
      },
      'delete-channel': (channel) => {
        io.emit('delete-channel', channel);
      },
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
