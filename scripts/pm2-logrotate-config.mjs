import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const configPath = process.argv[2] || "pm2-logrotate.json";
const absolutePath = path.resolve(configPath);

if (!fs.existsSync(absolutePath)) {
  console.error(`[pm2-logrotate] config file not found: ${absolutePath}`);
  process.exit(1);
}

const configRaw = fs.readFileSync(absolutePath, "utf8");
const config = JSON.parse(configRaw);

const moduleName = config.module || "pm2-logrotate";
const settings = config.settings;

if (!settings || typeof settings !== "object") {
  console.error("[pm2-logrotate] invalid config: settings is required");
  process.exit(1);
}

const run = (args) => {
  const result = spawnSync("npx", args, { stdio: "inherit", shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

for (const [key, value] of Object.entries(settings)) {
  run(["pm2", "set", `${moduleName}:${key}`, String(value)]);
}

run(["pm2", "conf", moduleName]);
