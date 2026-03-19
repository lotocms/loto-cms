import express from "express";
import auth from "../../middleware/auth.js";
import init from "../../middleware/init.js";

const { loadController } = Chan.helper;
const { singleUpload } = Chan.common;

let controller = await loadController("cms");

export default (app, _, chanInst) => {
  const cmsRouter = express.Router();
  cmsRouter.use(init());

  // 站点信息
  cmsRouter.get("/site/info", auth(), controller.Site.info);
  cmsRouter.post("/site/update", auth(), controller.Site.update);
  cmsRouter.get("/site/runEnv", auth(), controller.Site.runEnv); // 添加认证保护
  cmsRouter.get("/sysApp/find", auth(), controller.sysApp.find); // 添加认证保护
  cmsRouter.get("/sysApp/views", auth(), controller.sysApp.getViews); // 添加认证保护
  cmsRouter.get("/sysApp/folder", auth(), controller.sysApp.folder); // 添加认证保护
  // cmsRouter.get("/sysApp/config", controller.sysApp.config);
  cmsRouter.post("/sysApp/update", auth(), controller.sysApp.update);

  // 网站栏目
  cmsRouter.get("/category/find", controller.category.find);
  cmsRouter.get("/category/findId", controller.category.findId);
  cmsRouter.get("/category/findSubId", controller.category.findSubId);
  cmsRouter.get("/category/search", controller.category.search);
  cmsRouter.get("/category/delete", auth(), controller.category.delete);
  cmsRouter.post("/category/update", auth(), controller.category.update);
  cmsRouter.post("/category/create", auth(), controller.category.create);

  // 文章栏目
  cmsRouter.get("/article/list", controller.article.list);
  cmsRouter.get("/article/tongji", controller.article.tongji);
  cmsRouter.get("/article/search", controller.article.search);
  cmsRouter.get("/article/detail", controller.article.detail);
  cmsRouter.get("/article/findField", auth(), controller.article.findField);
  cmsRouter.post("/article/create", auth(), controller.article.create);
  cmsRouter.get("/article/delete", auth(), controller.article.delete);
  cmsRouter.post("/article/update", auth(), controller.article.update);

  //上传
  //cmsRouter.post("/upload", auth(), upload.any(), controller.article.upload);
  cmsRouter.get("/article/delfile", auth(), controller.article.delfile);
  // 七牛云相关
  cmsRouter.get("/qiniu/getUploadToken", auth(), controller.qiniu.getUploadToken);
  cmsRouter.post("/qiniu/upload", auth(), singleUpload(), controller.qiniu.upload);

  // 模型管理
  cmsRouter.get("/model/list", auth(), controller.model.list); // 添加认证保护
  cmsRouter.get("/model/detail", auth(), controller.model.detail); // 添加认证保护
  cmsRouter.get("/model/hasUse", auth(), controller.model.hasUse);
  cmsRouter.post("/model/create", auth(), controller.model.create);
  cmsRouter.post("/model/delete", auth(), controller.model.delete);
  cmsRouter.post("/model/update", auth(), controller.model.update);

  // 字段管理
  cmsRouter.get("/field/list", auth(), controller.field.list); // 添加认证保护
  cmsRouter.get("/field/detail", auth(), controller.field.detail); // 添加认证保护
  cmsRouter.post("/field/create", auth(), controller.field.create);
  cmsRouter.get("/field/delete", auth(), controller.field.delete);
  cmsRouter.post("/field/update", auth(), controller.field.update);

  // 碎片管理
  cmsRouter.get("/frag/list", controller.frag.list);
  cmsRouter.get("/frag/search", controller.frag.search);
  cmsRouter.get("/frag/detail", controller.frag.detail);
  cmsRouter.post("/frag/create", auth(), controller.frag.create);
  cmsRouter.get("/frag/delete", auth(), controller.frag.delete);
  cmsRouter.post("/frag/update", auth(), controller.frag.update);

  // tag标签管理
  cmsRouter.get("/tag/list", controller.tag.list);
  cmsRouter.post("/tag/create", auth(), controller.tag.create);
  cmsRouter.get("/tag/detail", controller.tag.detail);
  cmsRouter.get("/tag/has", controller.tag.has);
  cmsRouter.get("/tag/search", controller.tag.search);
  cmsRouter.get("/tag/delete", auth(), controller.tag.delete);
  cmsRouter.post("/tag/update", auth(), controller.tag.update);

  // 友情链接
  cmsRouter.get("/friendlink/list", controller.friendlink.list);
  cmsRouter.get("/friendlink/detail", controller.friendlink.detail);
  cmsRouter.post("/friendlink/create", auth(), controller.friendlink.create);
  cmsRouter.get("/friendlink/delete", auth(), controller.friendlink.delete);
  cmsRouter.post("/friendlink/update", auth(), controller.friendlink.update);

  // 留言管理
  cmsRouter.get("/message/list", auth(), controller.message.list); // 添加认证保护
  cmsRouter.get("/message/search", auth(), controller.message.search); // 添加认证保护
  cmsRouter.get("/message/detail", auth(), controller.message.detail); // 添加认证保护
  cmsRouter.post("/message/create", controller.message.create);
  cmsRouter.get("/message/delete", auth(), controller.message.delete);
  cmsRouter.post("/message/update", auth(), controller.message.update);

  // 轮播管理
  cmsRouter.get("/slide/list", controller.slide.list);
  cmsRouter.get("/slide/search", controller.slide.search);
  cmsRouter.get("/slide/detail", controller.slide.detail);
  cmsRouter.post("/slide/create", auth(), controller.slide.create);
  cmsRouter.get("/slide/delete", auth(), controller.slide.delete);
  cmsRouter.post("/slide/update", auth(), controller.slide.update);

  //页面采集
  cmsRouter.post("/collect/getPages", auth(), controller.collect.getPages);
  cmsRouter.post("/collect/getArticle", auth(), controller.collect.getArticle);
  cmsRouter.get("/collect/list", auth(), controller.collect.list); // 添加认证保护
  cmsRouter.get("/collect/search", auth(), controller.collect.search); // 添加认证保护
  cmsRouter.get("/collect/detail", auth(), controller.collect.detail); // 添加认证保护
  cmsRouter.post("/collect/create", auth(), controller.collect.create);
  cmsRouter.get("/collect/delete", auth(), controller.collect.delete);
  cmsRouter.post("/collect/update", auth(), controller.collect.update);

  //接口采集
  cmsRouter.get("/gather/getArticle", auth(), controller.gather.getArticle);
  cmsRouter.get("/gather/list", auth(), controller.gather.list); // 添加认证保护
  cmsRouter.get("/gather/search", auth(), controller.gather.search); // 添加认证保护
  cmsRouter.get("/gather/detail", auth(), controller.gather.detail); // 添加认证保护
  cmsRouter.post("/gather/create", auth(), controller.gather.create);
  cmsRouter.get("/gather/delete", auth(), controller.gather.delete);
  cmsRouter.post("/gather/update", auth(), controller.gather.update);

  //登录日志
  cmsRouter.post("/loginLog/create", auth(), controller.loginLog.create);
  cmsRouter.get("/loginLog/delete", auth(), controller.loginLog.delete);
  cmsRouter.get("/loginLog/list", auth(), controller.loginLog.list);

  //配置前缀
  const prefix = "/cms";
  app.use(prefix, cmsRouter);

  // update
  chanInst.collectingRoutes(cmsRouter, prefix, "cms");
};
