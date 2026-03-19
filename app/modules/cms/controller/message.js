const {
  common: { success },
  helper: { formatDateFields },
} = Chan;
import message from "../service/message.js";
class MessageController extends Chan.Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await message.create(body);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await message.delete(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await message.update(body);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      let data = await message.detail(id);
      data = formatDateFields(data);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 20 } = req.query;
      let data = await message.search(keyword, cur, pageSize);
      data.list = formatDateFields(data.list);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize = 20 } = req.query;
      let result = await message.list(cur, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(this.success({ data: result.data }));
    } catch (err) {
      next(err);
    }
  }
}

export default new MessageController();
