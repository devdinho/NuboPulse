const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const url = require('url');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const server = http.createServer(app);
const secretToken = process.env.WEBHOOK_SECRET;
const originUrl = process.env.ORIGIN_URL || 'https://nubo.a6n.tech';

const systemInfoHandler = require('./routes/systemInfo');
const dockerStatsHandler = require('./routes/dockerStats');
const deployHandler = require('./routes/deploy');
const powershiftHandler = require('./routes/powershift');
const { setupTerminal } = require('./routes/terminal');

const io = socketIO(server, {
  path: '/terminal/socket.io',
  cors: {
    origin: originUrl,
    methods: ['GET', 'POST'],
  }
});

setupTerminal(io);

deployHandler(app);
app.use('/powershift', powershiftHandler);

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