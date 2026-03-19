import express from "express";

import init from "./middleware/init.js";
import site from "../../middleware/init.js";
import adapter from "./middleware/adapter.js";
import safe from "express-safe";
const {
  helper: { loadController },
} = Chan;
let controller = await loadController("web");
export default async (app, _, chanInst) => {
  const webRouter = express.Router();

  webRouter.use(adapter());
  webRouter.use(safe());
  webRouter.use(site());
  webRouter.use(init());

  // 首页模板
  webRouter.get(["/", "/index.html", "/index.php"], controller.home.index);

  // 分类
  webRouter.get(
    [
      "/list/:cid", // 兼容 old
      "/:cate/index.html",
      "/:cate/index:current.html",
      "/:cate1/:cate/index.html",
      "/:cate1/:cate/index:current.html",
      "/:cate2/:cate1/:cate/index.html",
      "/:cate2/:cate1/:cate/index:current.html",
      "/:cate3/:cate2/:cate1/:cate/index.html",
      "/:cate3/:cate2/:cate1/:cate/index:current.html",
    ],
    controller.home.list
  );

  // 文章页
  webRouter.get(
    [
      "/article/:id", // 兼容 old
      "/article/:id.html", // 兼容 old
      "/article-:id.html",
      "/:cate/article-:id.html",
      "/:cate1/:cate/article-:id.html",
      "/:cate2/:cate1/:cate/article-:id.html",
      "/:cate2/:cate1/:cate/article-:id.html",
      "/:cate3/:cate2/:cate1/:cate/article-:id.html",
    ],
    controller.home.article
  );

  // 单页栏目
  webRouter.get(
    [
      "/page/:id", // 兼容 old
      "/page/:id.html", // 兼容 old
      "/page-:id.html",
      "/:cate/page.html",
      "/:cate1/:cate/page.html",
      "/:cate2/:cate1/:cate/page.html",
      "/:cate3/:cate2/:cate1/:cate/page.html",
      "/:cate/page-:id.html",
      "/:cate1/:cate/page-:id.html",
      "/:cate2/:cate1/:cate/page-:id.html",
      "/:cate2/:cate1/:cate/page-:id.html",
      "/:cate3/:cate2/:cate1/:cate/page-:id.html",
    ],
    controller.home.page
  );

  // 搜索页
  webRouter.get(
    ["/search/:keywords/words.html", "/search/:keywords/words:current.html"],
    controller.home.search
  );

  // tag列表页
  webRouter.get(["/tags/:path/tag.html", "/tags/:path/tag:current.html"], controller.home.tag);
  // 使用路由
  app.use(webRouter);
};
