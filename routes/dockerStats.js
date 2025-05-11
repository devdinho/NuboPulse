const WebSocket = require('ws');
const { broadcastDockerStats } = require('../services/broadcastDockerStatus');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Conectado no /docker-stats');

    const interval = setInterval(async () => {
        try {
            const data = await broadcastDockerStats();
            ws.send(data);
        } catch (error) {
            console.error('Erro ao obter informações do docker:', error);
        }
    }, 2000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Conexão encerrada no /docker-stats');
    });
});

module.exports = {
  handleUpgrade(req, socket, head) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  },
};