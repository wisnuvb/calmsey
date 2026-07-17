module.exports = {
  apps: [
    {
      name: "turningtidesfacility",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 2039",
      cwd: "/var/www/html/projects/turningtidesfacility",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "2039",
      },
      // Auto-restart saat crash / OOM (default true; ditulis eksplisit)
      autorestart: true,
      restart_delay: 3000,
      exp_backoff_restart_delay: 100,
      // Memory & restart
      max_memory_restart: "1536M",
      max_restarts: 15,
      min_uptime: "10s",
      // Graceful shutdown
      kill_timeout: 15000,
      listen_timeout: 10000,
      // Logging
      output: "/var/www/html/projects/turningtidesfacility/logs/out.log",
      error: "/var/www/html/projects/turningtidesfacility/logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      max_size: "10M",
      max_file: 5,
    },
  ],
};
