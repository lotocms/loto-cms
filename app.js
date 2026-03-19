import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const runtimeDir = dirname(fileURLToPath(import.meta.url));
process.chdir(runtimeDir);

globalThis.requirejs = createRequire(import.meta.url);

const { default: Chan } = await import("@lotomic/chanjs");
const serverPort = process.env.PORT ? Number(process.env.PORT) : 8000;

const chan = new Chan({
  port: serverPort,
  snowId: 1,
  collectModules: process.env.DEV_COLLECT_MODULES || "",
});
await chan.start();

await chan.run((port) => {
  console.log(`🌟 ${Chan.config.APP_NAME} is running on  http://localhost:${port}`);
  console.log(`🌟 ${Chan.config.APP_NAME} is running on  http://localhost:${port}/public/admin`);
});
