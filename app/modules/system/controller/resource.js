import { Comments, InvalidError } from "@lotomic/chanjs";
import resourceService from "../service/resource.js";
class ResourceController extends Chan.Controller {
  @Comments("资源分页查询")
  async list(req, res, next) {
    try {
      const query = req.query;
      const ret = await resourceService.pageList(query);

      res.json(ret);
    } catch (error) {
      next(error);
    }
  }

  @Comments("资源详情")
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) throw new InvalidError();
      const ret = await resourceService.findById(id);
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }

  @Comments("更新资源备注")
  async save(req, res, next) {
    try {
      const { id, remark } = req.body;
      if (!id) throw new InvalidError();
      const ret = await resourceService.save({
        id,
        remark,
        update_by: req?.user.uid ? req.user.uid : undefined,
      });
      res.json(ret);
    } catch (error) {
      next(error);
    }
  }
}

export default new ResourceController();
