import Chan from "@lotomic/chanjs";

// Compatibility shim for chanjs typo: COMM_PATH vs COMMON_PATH.
if (typeof globalThis.COMM_PATH === "undefined" && typeof globalThis.COMMON_PATH !== "undefined") {
  Object.defineProperty(globalThis, "COMM_PATH", {
    value: globalThis.COMMON_PATH,
    writable: false,
    configurable: false,
    enumerable: true,
  });
}

const chan = new Chan();
await chan.start(() => {
  // console.log("Starting Chan...", Chan.config);
});

chan.beforeStart(async () => {
  // await chan.loadConfig();
});

chan.run((port) => {
  console.log(`${Chan.config.APP_NAME} is running on ${port}`);
  console.log("Starting Chan...", Chan.config);
});
