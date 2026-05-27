const { spawn } = require('child_process');

function startTunnel() {
  const ssh = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ExitOnForwardFailure=yes',
    '-R', '80:localhost:8080',
    'nokey@localhost.run'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let url = '';

  ssh.stdout.on('data', (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-z0-9]+\.lhr\.life/);
    if (match) {
      url = match[0];
      console.log('TUNNEL_URL:' + url);
    }
  });

  ssh.stderr.on('data', (d) => {});

  ssh.on('exit', (code) => {
    console.log('SSH exited, restarting in 3s...');
    setTimeout(startTunnel, 3000);
  });

  // Heartbeat — if no stdout for 60s, restart
  let heartbeat = Date.now();
  ssh.stdout.on('data', () => { heartbeat = Date.now(); });
  setInterval(() => {
    if (Date.now() - heartbeat > 60000) {
      console.log('Tunnel heartbeat timeout, restarting...');
      ssh.kill();
    }
  }, 30000);
}

startTunnel();
