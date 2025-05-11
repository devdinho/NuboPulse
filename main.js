const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

// WebSockets com upgrade manual
const systemInfoHandler = require('./routes/systemInfo');
const dockerStatsHandler = require('./routes/dockerStats');
const deployHandler = require('./routes/deploy');

deployHandler(app);

server.on('upgrade', (req, socket, head) => {
  const pathname = req.url;

  if (pathname === '/system-info') {
    systemInfoHandler.handleUpgrade(req, socket, head);
  } else if (pathname === '/docker-stats') {
    dockerStatsHandler.handleUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(3000, () => console.log('HTTP + WS rodando na 3000'));