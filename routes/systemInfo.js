const WebSocket = require('ws');
const { getSystemInfo } = require('../services/systemInfo');

const wss = new WebSocket.Server({ noServer: true});

wss.on('connection', (ws) => {
    console.log('Conectado no /system-info');

    const interval = setInterval(async () => {
        try {
            const data = await getSystemInfo();
            ws.send(JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao obter informações do sistema:', error);
        }
    }, 2000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Conexão encerrada no /system-info');
    });
});

module.exports = {
  handleUpgrade(req, socket, head) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  },
};