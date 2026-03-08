import auth from "../../middleware/auth.js";
import init from "../../middleware/init.js";
const { loadController } = Chan.helper;
let controller = await loadController("system");

/**
 * app express instance
 */
export default (app, router, _config) => {
  router.use(init());
  // audit
  router.get("/audit/health", controller.auditlog.health);
  router.get("/audit/logs/list", controller.auditlog.list);
  router.post("/audit/logs/create", auth(), controller.auditlog.create);

  app.use("/system", router);
};
