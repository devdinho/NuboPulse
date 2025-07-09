const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const url = require('url');

const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');

dotenv.config();
const secretToken = process.env.WEBHOOK_SECRET;

const systemInfoHandler = require('./routes/systemInfo');
const dockerStatsHandler = require('./routes/dockerStats');
const deployHandler = require('./routes/deploy');
const { setupTerminal } = require('./routes/terminal');

const io = socketIO(server, {
  path: '/terminal/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

setupTerminal(io);

deployHandler(app);

server.on('upgrade', (req, socket, head) => {
  const { pathname, query } = url.parse(req.url, true);
  const token = query.token;
  
  if (token !== secretToken) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  if (pathname === '/system-info') {
    systemInfoHandler.handleUpgrade(req, socket, head);
  } else if (pathname === '/docker-stats') {
    dockerStatsHandler.handleUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(3000, () => console.log('HTTP + WS rodando na 3000'));