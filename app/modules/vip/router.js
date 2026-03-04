import auth  from "../../middleware/auth.js";
const { loadController } = Chan.helper;

let controller = await loadController("vip");

export default (app, router, config) => {
  router.get("/file/tree", auth(), controller.CodeFile.tree);
  router.get("/file/content", auth(), controller.CodeFile.content);
  router.post("/file/save", auth(), controller.CodeFile.save);
  router.get("/file/oss", auth(), controller.CodeFile.oss);

  app.use("/vip/v1", router);
};
