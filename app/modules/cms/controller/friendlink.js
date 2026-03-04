const {
  common: { success },
  helper: { formatDateFields },
} = Chan;
import friendlink from "../service/friendlink.js";
class FriendlinkController extends Chan.Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      let body = req.body;
      body = formatDateFields(body);
      const data = await friendlink.create(body);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await friendlink.delete(id);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await friendlink.update(body);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async find(req, res, next) {
    try {
      const { id } = req.query;
      const data = await friendlink.detail(id);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const result = await friendlink.detail(id);
      res.json(this.success({data:result.data}))
    } catch (err) {
      next(err);
    }
  }

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 10 } = req.query;
      const result = await friendlink.search(keyword, cur, pageSize);
      data = formatDateFields(data);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const cur = req.query.cur;
      const pageSize = 10;
      const result = await friendlink.list(cur, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(this.success({data:result.data}));  
    } catch (err) {
      next(err);
    }
  }
}

export default new FriendlinkController();
