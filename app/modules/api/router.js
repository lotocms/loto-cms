import express from "express";

const { loadController } = Chan.helper;
let controller = await loadController("api");
export default (app, _, chanInst) => {
  const apiRouter = express.Router();

  apiRouter.get("/site", controller.Api.site);
  apiRouter.get("/frag", controller.Api.fragList);
  apiRouter.get("/tag", controller.Api.getTag);
  apiRouter.get("/friendlink", controller.Api.getFriendlink);
  apiRouter.get("/category", controller.Api.category);
  apiRouter.get("/getArticleList", controller.Api.getArticleList);
  apiRouter.get("/getArticleListByCid", controller.Api.getArticleListByCid);
  apiRouter.get("/getArticleTag", controller.Api.getArticleTag);
  apiRouter.get(["/list", "/page"], controller.Api.list);
  apiRouter.get("/article", controller.Api.getArticle);
  apiRouter.get("/banner", controller.Api.banner);
  apiRouter.get("/pv", controller.Api.pv);
  apiRouter.get("/articleImg", controller.Api.articleImg);
  apiRouter.get("/tagList", controller.Api.tagList);
  apiRouter.get("/prev", controller.Api.prev);
  apiRouter.get("/next", controller.Api.next);

  apiRouter.get("/getTagsById", controller.Api.getTagsById);
  apiRouter.get("/search", controller.Api.search);
  apiRouter.get("/pvadd", controller.Api.pvadd);

  //配置前缀
  app.use("/api/v1", apiRouter);
  chanInst.collectingRoutes(apiRouter, "/api/v1", "api");
};
