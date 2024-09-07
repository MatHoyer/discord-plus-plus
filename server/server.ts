import { createServer } from 'http';
import next from 'next';
import { Server, Socket } from 'socket.io';
import { User } from './User';
import { UserManager } from './UserManager';
import { ChannelSocketEvents } from './socket/channel';
import { ClientSocketEvents } from './socket/client';

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
        const user = userManager.getUserById(userId);
        if (!user) {
          userManager.addUser(new User(userId, socket, io));
        } else {
          user!.socket = socket;
          userManager.changeUserActivity(socket.id, user.activityMemory);
        }
        const usersActivity = userManager.getUsersActivity();
        socket.emit(ClientSocketEvents.initActivity, usersActivity);
      },
      disconnect: () => {
        console.log(`${bold}${yellow}user disconnected${reset}`);
        userManager.changeUserActivity(socket.id, 'Offline');
      },
      'new-message': ({ channelId, message }) => {
        io.emit(ChannelSocketEvents.newMessage(channelId), message);
      },
      'edit-message': (data) => {
        io.emit(ChannelSocketEvents.editMessage(data.channelId), data);
      },
      mention: ({ channelId, mentions }) => {
        for (const mention of mentions) {
          const user = userManager.getUserById(mention.member.userId);
          if (!user) continue;
          if (user.socket) {
            user.socket.emit(ChannelSocketEvents.mention(channelId), mention);
          }
        }
      },
      'reacted-to-message': ({ channelId, reaction }) => {
        io.emit(ChannelSocketEvents.reactedToMessage(channelId), reaction);
      },
      'delete-reaction': ({ channelId, reactionId }) => {
        io.emit(ChannelSocketEvents.deleteReaction(channelId), reactionId);
      },
      'delete-attachment': ({ channelId, attachmentId }) => {
        io.emit(ChannelSocketEvents.deleteAttachment(channelId), attachmentId);
      },
      'delete-message': ({ channelId, messageId }) => {
        io.emit(ChannelSocketEvents.deleteMessage(channelId), messageId);
      },
      'change-activity': ({ activity }) => {
        userManager.changeUserActivity(socket.id, activity);
        const user = userManager.getUserBySocketId(socket.id);
        if (!user) return;
        io.emit(ClientSocketEvents.activityChange, {
          userId: user!.id,
          activity,
        });
      },
      'new-channel': (channel) => {
        io.emit(ClientSocketEvents.newChannel, channel);
      },
      'edit-channel': (channel) => {
        io.emit(ClientSocketEvents.editChannel, channel);
      },
      'delete-channel': (channel) => {
        io.emit(ClientSocketEvents.deleteChannel, channel);
      },
      'is-typing': ({ channelId, username }) => {
        io.emit(ChannelSocketEvents.isTyping(channelId), username);
      },
      'stop-typing': ({ channelId, username }) => {
        io.emit(ChannelSocketEvents.stopTyping(channelId), username);
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
