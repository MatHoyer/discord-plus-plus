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
	const yellow = '\x1b[33mSOCKET: ';
	const bold = '\x1b[1m';
	const reset = '\x1b[0m';

	const httpServer = createServer(handler);

	const io = new Server(httpServer);

	const socketMiddleware = (socket, eventHandlers) => {
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
			disconnect: () => {
				console.log(`${bold}${yellow}user disconnected${reset}`);
			},
			'new-message': (data) => {
				io.emit(`channel:${data.channelId}:new-message`, data.message);
			},
			'edit-message': (data) => {
				io.emit(`channel:${data.channelId}:edit-message`, data);
			}
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
