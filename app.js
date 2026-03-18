import { createRequire } from "node:module";

globalThis.requirejs = createRequire(import.meta.url);

const { default: Chan } = await import("@lotomic/chanjs");

const rebuildResources = process.env.REBUILD_RESOURCES === "true" ? true : false;
const chan = new Chan({ port: 4000, snowId: 1, rebuildResources });
await chan.start();

await chan.run((port) => {
  console.log(`🌟 ${Chan.config.APP_NAME} is running on  http://localhost:${port}`);
  console.log(`🌟 ${Chan.config.APP_NAME} is running on  http://localhost:${port}/public/admin`);

  console.log("<<<>>>", chan.app.router);
});
