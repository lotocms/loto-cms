import path from "path";
import { safePathSchema } from "../../../middleware/guard.js";
const {
  config: { APP_VERSION, APP_NAME, port, APP_VERSION_TIME, APP_AUTHOR_EMAIL, APP_AUTHOR_WECHAT },
  helper: { delImg, formatDateFields },
  common: { success, fail, filterBody },
} = Chan;
import article from "../service/article.js";

class ArticleController extends Chan.Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      body.defaultParams.content = filterBody(body.defaultParams.content);
      const data = await article.create(body);
      res.json(this.success(data));
    } catch (err) {
      console.error("[ArticleController.create] 错误:", err);
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await article.delete(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      let body = req.body;
      body.content = filterBody(body.content);
      const data = await article.update(body);
      res.json(this.success(data));
    } catch (err) {
      console.error("[ArticleController.update] 错误:", err);
      next(err);
    }
  }

  // 查
  async find(req, res, next) {
    try {
      const data = await article.find();
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await article.detail(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, cid = 0, pageSize = 20 } = req.query;
      const data = await article.search(keyword, cur, pageSize, +cid);
      data.list = formatDateFields(data.list);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { cur, cid, pageSize = 10 } = req.query;
      const data = await article.list(cur, pageSize, cid);
      data.list = formatDateFields(data.list);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 上传图片
  async upload(req, res, next) {
    try {
      let file = req.files;
      const { originalname, filename, path } = file[0];
      res.json(
        this.success({
          data: {
            link: path.replace("app", ""),
            domain: req.hostname,
            originalname,
            filename,
            path: "/" + path.replace(/\\/g, "/").replace(/^app\//, ""),
          },
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async findField(req, res, next) {
    try {
      const { cid } = req.query;
      const data = await article.findField(cid);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async tongji(req, res, next) {
    try {
      const result = await article.tongji();
      res.json(
        this.success({
          data: {
            ...result.data,
            APP_VERSION,
            APP_NAME,
            APP_VERSION_TIME,
            APP_AUTHOR_EMAIL,
            APP_AUTHOR_WECHAT,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async delfile(req, res, next) {
    try {
      const { url } = req.query;
      let filePath = path.join(Chan.paths.appPath, url);
      const result = safePathSchema.safeParse(url);
      if (!result.success) {
        return res.json(this.fail({ msg: "非法访问路径: 禁止访问系统目录", data: [] }));
      }
      let data = delImg(filePath);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new ArticleController();
