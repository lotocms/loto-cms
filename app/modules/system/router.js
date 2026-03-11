import express from "express";
import auth from "../../middleware/auth.js";
import init from "../../middleware/init.js";

const { loadController } = Chan.helper;
let controller = await loadController("system");

/**
 * app express instance
 * controller.[controller-file-name].method
 */
export default (app, router, _config) => {
  const systemRouter = express.Router();
  systemRouter.use(init());

  // menu TODO auth
  systemRouter.get("/menu/list", controller.menu.list);

  // audit
  systemRouter.get("/audit/health", controller.auditlog.health);
  systemRouter.get("/audit/logs/list", controller.auditlog.list);
  systemRouter.post("/audit/logs/create", auth(), controller.auditlog.create);

  app.use("/system", systemRouter);

};
