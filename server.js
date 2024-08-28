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

  io.on('connection', (socket) => {
    console.log(`${yellow}user connected${reset}`);

    socket.on('disconnect', () => {
      console.log(`${yellow}user disconnected${reset}`);
    });

    socket.on('ping', (data) => {
      console.log(`${yellow}ping ${data}${reset}`);
      socket.emit('pong', data);
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
