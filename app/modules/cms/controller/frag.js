const {
  common: { success },
  helper: { formatDateFields },
} = Chan;

import frag from "../service/frag.js";
class FragController extends Chan.Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await frag.create(body);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await frag.delete(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await frag.update(body);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async find(req, res, next) {
    try {
      const data = await frag.detail();
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await frag.detail(id);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keywords, pageSize = 20 } = req.query;
      const data = await frag.search(keywords, cur, pageSize);
      data.list = formatDateFields(data.list);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize = 10 } = req.query;
      const data = await frag.list(cur, pageSize);
      data.list = formatDateFields(data.list);
      res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }
}

export default new FragController();
