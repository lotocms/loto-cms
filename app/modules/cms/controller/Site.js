const {
  common: { success, fail },
  config,
} = Chan;
import Site from "../service/Site.js";

class SiteController extends Chan.Controller {
  // 查
  async info(req, res, next) {
    try {
      const result = await Site.info();
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const result = await Site.updateInfo(body);
      res.json(this.success(result));
    } catch (err) {
      next(err);
    }
  }

  // 获取磁盘信息
  async runEnv(req, res, next) {
    try {
      res.json(this.success({ data: { dirname: Chan.paths.rootPath } }));
    } catch (err) {
      next(err);
    }
  }
}

export default new SiteController();
