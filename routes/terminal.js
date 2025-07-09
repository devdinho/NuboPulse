const pty = require('node-pty');

/**
 * Registra o namespace `/terminal` no socket.io
 * @param {import('socket.io').Server} io
 */

const secretToken = process.env.WEBHOOK_SECRET;

function setupTerminal(io) {
  const terminalNamespace = io.of('/terminal');

  terminalNamespace.on('connection', (socket) => {
    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
    const term = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env
    });

    const token = socket.handshake.auth.token;

    if (!token || token !== secretToken) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        return socket.disconnect();
    }

    term.on('data', (data) => {
      socket.emit('output', data);
    });

    socket.on('input', (data) => {
      term.write(data);
    });

    socket.on('resize', ({ cols, rows }) => {
      term.resize(cols, rows);
    });

    socket.on('disconnect', () => {
      term.kill();
      console.log('Cliente desconectado do terminal.');
    });
  });
}

module.exports = { setupTerminal };