import auth from "../../middleware/auth.js";
import init from "../../middleware/init.js";

const { loadController } = Chan.helper;
const { singleUpload } = Chan.common;

let controller = await loadController("cms");

export default (app, router, config) => {
  router.use(init());

  // 站点信息
  router.get("/site/info", auth(), controller.Site.info);
  router.post("/site/update", auth(), controller.Site.update);
  router.get("/site/runEnv", auth(), controller.Site.runEnv); // 添加认证保护
  router.get("/sysApp/find", auth(), controller.sysApp.find); // 添加认证保护
  router.get("/sysApp/views", auth(), controller.sysApp.getViews); // 添加认证保护
  router.get("/sysApp/folder", auth(), controller.sysApp.folder); // 添加认证保护
  // router.get("/sysApp/config", controller.sysApp.config);
  router.post("/sysApp/update", auth(), controller.sysApp.update);

  // 网站栏目
  router.get("/category/find", controller.category.find);
  router.get("/category/findId", controller.category.findId);
  router.get("/category/findSubId", controller.category.findSubId);
  router.get("/category/search", controller.category.search);
  router.get("/category/delete", auth(), controller.category.delete);
  router.post("/category/update", auth(), controller.category.update);
  router.post("/category/create", auth(), controller.category.create);

  // 文章栏目
  router.get("/article/list", controller.article.list);
  router.get("/article/tongji", controller.article.tongji);
  router.get("/article/search", controller.article.search);
  router.get("/article/detail", controller.article.detail);
  router.get("/article/findField", auth(), controller.article.findField);
  router.post("/article/create", auth(), controller.article.create);
  router.get("/article/delete", auth(), controller.article.delete);
  router.post("/article/update", auth(), controller.article.update);

  //上传
  //router.post("/upload", auth(), upload.any(), controller.article.upload);
  router.get("/article/delfile", auth(), controller.article.delfile);
  // 七牛云相关
  router.get("/qiniu/getUploadToken", auth(), controller.qiniu.getUploadToken);
  router.post("/qiniu/upload", auth(), singleUpload(), controller.qiniu.upload);

  // 模型管理
  router.get("/model/list", auth(), controller.model.list); // 添加认证保护
  router.get("/model/detail", auth(), controller.model.detail); // 添加认证保护
  router.get("/model/hasUse", auth(), controller.model.hasUse);
  router.post("/model/create", auth(), controller.model.create);
  router.post("/model/delete", auth(), controller.model.delete);
  router.post("/model/update", auth(), controller.model.update);

  // 字段管理
  router.get("/field/list", auth(), controller.field.list); // 添加认证保护
  router.get("/field/detail", auth(), controller.field.detail); // 添加认证保护
  router.post("/field/create", auth(), controller.field.create);
  router.get("/field/delete", auth(), controller.field.delete);
  router.post("/field/update", auth(), controller.field.update);

  // 碎片管理
  router.get("/frag/list", controller.frag.list);
  router.get("/frag/search", controller.frag.search);
  router.get("/frag/detail", controller.frag.detail);
  router.post("/frag/create", auth(), controller.frag.create);
  router.get("/frag/delete", auth(), controller.frag.delete);
  router.post("/frag/update", auth(), controller.frag.update);

  // tag标签管理
  router.get("/tag/list", controller.tag.list);
  router.post("/tag/create", auth(), controller.tag.create);
  router.get("/tag/detail", controller.tag.detail);
  router.get("/tag/has", controller.tag.has);
  router.get("/tag/search", controller.tag.search);
  router.get("/tag/delete", auth(), controller.tag.delete);
  router.post("/tag/update", auth(), controller.tag.update);

  // 友情链接
  router.get("/friendlink/list", controller.friendlink.list);
  router.get("/friendlink/detail", controller.friendlink.detail);
  router.post("/friendlink/create", auth(), controller.friendlink.create);
  router.get("/friendlink/delete", auth(), controller.friendlink.delete);
  router.post("/friendlink/update", auth(), controller.friendlink.update);

  // 留言管理
  router.get("/message/list", auth(), controller.message.list); // 添加认证保护
  router.get("/message/search", auth(), controller.message.search); // 添加认证保护
  router.get("/message/detail", auth(), controller.message.detail); // 添加认证保护
  router.post("/message/create", controller.message.create);
  router.get("/message/delete", auth(), controller.message.delete);
  router.post("/message/update", auth(), controller.message.update);

  // 轮播管理
  router.get("/slide/list", controller.slide.list);
  router.get("/slide/search", controller.slide.search);
  router.get("/slide/detail", controller.slide.detail);
  router.post("/slide/create", auth(), controller.slide.create);
  router.get("/slide/delete", auth(), controller.slide.delete);
  router.post("/slide/update", auth(), controller.slide.update);

  //页面采集
  router.post("/collect/getPages", auth(), controller.collect.getPages);
  router.post("/collect/getArticle", auth(), controller.collect.getArticle);
  router.get("/collect/list", auth(), controller.collect.list); // 添加认证保护
  router.get("/collect/search", auth(), controller.collect.search); // 添加认证保护
  router.get("/collect/detail", auth(), controller.collect.detail); // 添加认证保护
  router.post("/collect/create", auth(), controller.collect.create);
  router.get("/collect/delete", auth(), controller.collect.delete);
  router.post("/collect/update", auth(), controller.collect.update);

  //接口采集
  router.get("/gather/getArticle", auth(), controller.gather.getArticle);
  router.get("/gather/list", auth(), controller.gather.list); // 添加认证保护
  router.get("/gather/search", auth(), controller.gather.search); // 添加认证保护
  router.get("/gather/detail", auth(), controller.gather.detail); // 添加认证保护
  router.post("/gather/create", auth(), controller.gather.create);
  router.get("/gather/delete", auth(), controller.gather.delete);
  router.post("/gather/update", auth(), controller.gather.update);

  //登录日志
  router.post("/loginLog/create", auth(), controller.loginLog.create);
  router.get("/loginLog/delete", auth(), controller.loginLog.delete);
  router.get("/loginLog/list", auth(), controller.loginLog.list);

  //配置前缀
  app.use("/cms", router);
};
