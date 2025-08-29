const pty = require('node-pty');

const WebSocket = require('ws');

function handleUpgrade(req, socket, head) {
  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
  const term = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
  });

  // Criar WebSocket nativo
  const wss = new WebSocket.Server({ noServer: true });
  wss.handleUpgrade(req, socket, head, function done(ws) {
    ws.on('message', function incoming(message) {
      // Espera JSON: {type: 'input'|'resize', data}
      try {
        const msg = JSON.parse(message);
        if (msg.type === 'input') {
          term.write(msg.data);
        } else if (msg.type === 'resize') {
          const { cols, rows } = msg.data;
          term.resize(cols, rows);
        }
      } catch (e) {
        // Ignora mensagens inválidas
      }
    });

    term.on('data', (data) => {
      ws.send(JSON.stringify({ type: 'output', data }));
    });

    ws.on('close', () => {
      term.kill();
      console.log('Cliente desconectado do terminal.');
    });
  });
}

module.exports = { handleUpgrade };