const osu = require('os-utils');
const si = require('systeminformation');

async function getSystemInfo() {
  return new Promise((resolve) => {
    osu.cpuUsage(async (cpu_usage) => {
      const memory = await si.mem();
      const disk = await si.fsSize();
      const net = await si.networkStats();

      resolve({
        cpu_usage_percent: cpu_usage * 100, // de 0–1 para 0–100
        memory_total: memory.total,
        memory_available: memory.available,
        memory_percent: (1 - memory.available / memory.total) * 100,
        disk_total: disk[0]?.size || 0,
        disk_used: disk[0]?.used || 0,
        disk_percent: disk[0]?.use || 0,
        network_sent: net[0]?.tx_bytes || 0,
        network_recv: net[0]?.rx_bytes || 0,
      });
    });
  });
}

module.exports = {
  getSystemInfo,
};