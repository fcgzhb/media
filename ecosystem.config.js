module.exports = {
  apps: [{
    name: 'media-content-scheduler',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
    env: {
      PORT: 3400,
      NODE_ENV: 'production'
    }
  }]
};
