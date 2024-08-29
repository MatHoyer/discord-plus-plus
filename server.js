const next = require('next');
const { createServer } = require('http');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const yellow = '\x1b[33m SOCKET: ';
  const reset = '\x1b[0m';

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const socketMiddleware = (socket, eventHandlers) => {
    for (const [event, handler] of Object.entries(eventHandlers)) {
      socket.on(event, (...args) => {
        console.log(`${yellow}${event} event triggered${reset}`);
        handler(...args);
      });
    }
  };

  io.on('connection', (socket) => {
    console.log(`${yellow}user connected${reset}`);

    socketMiddleware(socket, {
      disconnect: () => {
        console.log(`${yellow}user disconnected${reset}`);
      },
      ping: (data) => {
        socket.emit('pong', data);
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
