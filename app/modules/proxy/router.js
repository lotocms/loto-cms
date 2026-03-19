import express from "express";

const { loadController } = Chan.helper;
let controller = await loadController("proxy");

export default (app, _router, chanInst) => {
  const proxyRouter = express.Router();
  //用户
  proxyRouter.get("/ip", controller.Client.ip);

  //配置前缀
  app.use("/proxy/v1", proxyRouter);

  chanInst.collectingRoutes(proxyRouter, "/proxy/v1", "proxy");
};
