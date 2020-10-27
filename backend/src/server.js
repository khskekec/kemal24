import dotenv from './services/dotenv';
import {createServer} from 'http';
import app from './app';
import createWebSocketServer from './websocket';

const server = createServer(app.callback());
const wss = createWebSocketServer(app);

server.on('upgrade', function upgrade(request, socket, head) {
    if (request.url !== '/?appCode=' + process.env.APP_CODE) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request, socket);
    });
});

export default server;