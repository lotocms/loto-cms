import { z } from "zod";
import loginLog from "../service/loginLog.js";

const {
  config,
  helper: { getToken, formatDateFields },
  common: { success },
} = Chan;

const schemas = {
  list: z.object({
    cur: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
  }),
};

class LoginLogController extends Chan.Controller {
  constructor() {
    super();
  }
  // 增
  async create(req, res, next) {
    try {
      const token = req.headers.token;
      const user = await getToken(token, config.JWT_SECRET);
      let body = {
        uid: user.uid,
        ...req.body,
      };
      const data = await loginLog.create(body);
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 删除
  async delete(req, res, next) {
    try {
      const { ids } = req.query;
      let data;
      if (ids) {
        data = await loginLog.deleteByIds(ids);
      } else {
        data = await loginLog.delete();
      }
     res.json(this.success(data));
    } catch (err) {
      next(err);
    }
  }

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize } = schemas.list.parse(req.query);
      let result = await loginLog.list(cur, pageSize);
      result.data.list = formatDateFields(result.data.list);
      res.json(this.success({data:result.data}));

    } catch (err) {
      next(err);
    }
  }
}

export default new LoginLogController();
