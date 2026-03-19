import express from "express";

import auth from "../../middleware/auth.js";
import init from "../../middleware/init.js";
const { loadController } = Chan.helper;
const { singleUpload, multiUpload, logo } = Chan.common;
let controller = await loadController("base");
export default (app, _, chanInst) => {
  const baseRouter = express.Router();

  baseRouter.use(init());
  //菜单
  baseRouter.get("/menu/list", auth(), controller.SysMenu.list);
  baseRouter.get("/menu/detail", auth(), controller.SysMenu.detail);
  baseRouter.post("/menu/create", auth(), controller.SysMenu.create);
  baseRouter.post("/menu/update", auth(), controller.SysMenu.update);
  baseRouter.get("/menu/delete", auth(), controller.SysMenu.delete);
  baseRouter.get("/menu/allRouter", auth(), controller.SysMenu.allRouter);

  //角色
  baseRouter.get("/role/list", auth(), controller.SysRole.list);
  baseRouter.get("/role/detail", auth(), controller.SysRole.detail);
  baseRouter.post("/role/create", auth(), controller.SysRole.create);
  baseRouter.post("/role/update", auth(), controller.SysRole.update);
  baseRouter.get("/role/delete", auth(), controller.SysRole.delete);

  //角色&菜单
  baseRouter.get("/roleMenu/list", auth(), controller.SysRoleMenu.list);

  //用户
  baseRouter.post("/user/login", controller.SysUser.login);
  baseRouter.get("/user/list", auth(), controller.SysUser.list);
  baseRouter.get("/user/detail", auth(), controller.SysUser.detail);
  baseRouter.post("/user/create", auth(), controller.SysUser.create);
  baseRouter.post("/user/update", auth(), controller.SysUser.update);
  baseRouter.get("/user/delete", auth(), controller.SysUser.delete);

  //用户&角色
  baseRouter.get("/userRole/detail", auth(), controller.SysUserRole.detail);

  //配置类型
  baseRouter.get("/config-type/list", auth(), controller.ConfigType.list);
  baseRouter.get("/config-type/detail", auth(), controller.ConfigType.detail);
  baseRouter.post("/config-type/create", auth(), controller.ConfigType.create);
  baseRouter.post("/config-type/update", auth(), controller.ConfigType.update);
  baseRouter.get("/config-type/delete", auth(), controller.ConfigType.delete);

  //配置
  baseRouter.get("/config/list", auth(), controller.Config.list);
  baseRouter.get("/config/getlist", auth(), controller.Config.getlist);
  baseRouter.get("/config/detail", auth(), controller.Config.detail);
  baseRouter.post("/config/create", auth(), controller.Config.create);
  baseRouter.post("/config/update", auth(), controller.Config.update);
  baseRouter.post("/config/updateMany", auth(), controller.Config.updateMany);
  baseRouter.get("/config/delete", auth(), controller.Config.delete);

  //上传
  baseRouter.post("/upload/logo", auth(), logo(), controller.Upload.uploadImg);
  baseRouter.post("/upload/img", auth(), singleUpload(), controller.Upload.uploadImg);
  baseRouter.post("/upload/imgs", auth(), multiUpload(), controller.Upload.uploadImgs);
  baseRouter.post("/upload/file", auth(), singleUpload(), controller.Upload.uploadFile);
  baseRouter.post("/upload/files", auth(), multiUpload(), controller.Upload.uploadFiles);

  // baseRouter.post("/upload/chunk", auth(),chunk.upload,controller.Upload.chunkUpload);
  // baseRouter.post("/upload/merge", auth(),chunk.merge, controller.Upload.mergeChunk);

  //配置前缀
  app.use("/base", baseRouter);
  chanInst.collectingRoutes(baseRouter, "/base", "base");
};
