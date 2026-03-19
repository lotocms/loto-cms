import express from "express";
import auth from "../../middleware/auth.js";
const { loadController } = Chan.helper;

let controller = await loadController("vip");

export default (app, router, chanInst) => {
  const vipRouter = express.Router();

  vipRouter.get("/file/tree", auth(), controller.CodeFile.tree);
  vipRouter.get("/file/content", auth(), controller.CodeFile.content);
  vipRouter.post("/file/save", auth(), controller.CodeFile.save);
  vipRouter.get("/file/oss", auth(), controller.CodeFile.oss);

  app.use("/vip/v1", vipRouter);
};
