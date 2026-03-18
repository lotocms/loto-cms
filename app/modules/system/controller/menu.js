import menuService from "../service/menu.js";

const {
  config,
  helper: { getToken },
} = Chan;
/**
 * 2026
 * 迁移升级
 */
class MenuController extends Chan.Controller {
  /**
   * meun list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async list(req, res, next) {
    try {
      const query = req.query;
      const data = await menuService.list(query);
      res.json(this.success(data));
    } catch (error) {
      next(error);
    }
  }

  async allRouter(req, res, next) {
    try {
      let { id } = req.query;
      if (!id && !req?.user) {
        this.throwInvalidError({ msg: `请先登录`, code: 401 });
      }

      const data = await menuService.getUserRouter(id ?? req.user.uid);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await menuService.createNew(body);
      res.json(this.success(data));
    } catch (error) {
      next(error);
    }
  }

  async subList(req, res, next) {
    try {
      const query = req.query || {};
      const data = await menuService.getSubPageList(query);
      res.json(this.success(data));
    } catch (error) {
      next(error);
    }
  }

  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await menuService.findById(id);
      res.json(this.success(data));
    } catch (error) {
      next(error);
    }
  }

  async allTreeNodes(_req, res, next) {
    try {
      const data = await menuService.allMenuTreeNodes();
      res.json(this.success(data));
    } catch (error) {
      next(error);
    }
  }
}

export default new MenuController();
