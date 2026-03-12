import menuService from "../service/menu.js";
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

  async subList(req, res, next) {
    try {
      const query = req.query || {};
      const data = await menuService.getSubPageList(query);
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
