import express from "express";
import auth from "../../middleware/auth.js";
import init from "../../middleware/init.js";

const { loadController } = Chan.helper;
let controller = await loadController("system");

/**
 * app express instance
 * controller.[controller-file-name].method
 */
export default (app, router, chanInst) => {
  const systemRouter = express.Router();
  systemRouter.use(init());

  // suser
  systemRouter.get("/suser/detail", controller.LotoUser.detail);
  systemRouter.post("/suser/create", controller.LotoUser.create);

  // menu TODO auth

  systemRouter.get("/menu/authRouter", controller.menu.allRouter);
  systemRouter.post("/menu/create", controller.menu.create);
  systemRouter.get("/menu/detail", controller.menu.detail);
  systemRouter.get("/menu/list", controller.menu.list);

  systemRouter.get("/menu/sub_list", controller.menu.subList);
  systemRouter.get("/menu/tree/all_nodes", controller.menu.allTreeNodes);
  systemRouter.get("/menu/tree/auth_nodes", controller.menu.allTreeNodes);

  // audit
  systemRouter.get("/audit/health", controller.auditlog.health);
  systemRouter.get("/audit/logs/list", controller.auditlog.list);
  systemRouter.post("/audit/logs/create", auth(), controller.auditlog.create);

  app.use("/system", systemRouter);

  // initialize module routes
  chanInst.collectingRoutes(systemRouter, "/system", "system");
};
