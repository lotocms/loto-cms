const path = require("node:path");

const projectRoot = __dirname;
const logDir = path.join(projectRoot, "logs");

module.exports = {
  apps: [
    {
      name: "loto-cms",
      cwd: projectRoot,
      script: "dist/app.js",
      interpreter: "node",
      node_args: "--env-file=.env.prd",
      log_file: path.join(logDir, "loto-cms.log"),
      merge_logs: true,
      time: true,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
