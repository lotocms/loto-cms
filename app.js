import { createRequire } from "node:module";

globalThis.requirejs = createRequire(import.meta.url);

const { default: Chan } = await import("@lotomic/chanjs");

const chan = new Chan({ port: 4000, snowId: 1 });
await chan.start();

chan.run((port) => {
  console.log(`🌟 ${Chan.config.APP_NAME} is running on  http://localhost:${port}`);
  console.log(`🌟 ${Chan.config.APP_NAME} is running on  http://localhost:${port}/public/admin`);
});
