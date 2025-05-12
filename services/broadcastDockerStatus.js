const { execSync } = require('child_process');

async function broadcastDockerStats() {
  return new Promise((resolve) => {

    const output = execSync(
      `docker stats --no-stream --format '{{json .}}'`,
      { encoding: 'utf-8' }
    );

    const statsArray = output
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));
          
    resolve(JSON.stringify(statsArray));
  });
}

module.exports = {
  broadcastDockerStats,
};