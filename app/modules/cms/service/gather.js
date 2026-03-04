const {
  helper: { request },
} = Chan;
import { isValidTargetUrl } from "../../../middleware/guard.js";

class GatherService extends Chan.Service {
  constructor() {
    super(Chan.db, "plus_gather");
  }

  async common(url) {
    if (!isValidTargetUrl(url)) {
      throw new Error("不允许访问的目标地址");
    }
    const res = await request(url);
    return res;
  }

  // 增加
  async create(body) {
    const res = await this.insert(body);
    return res;
  }

  // 删
  async delete(id) {
    const res = await this.deleteById(id);
    return res;
  }

  // 修改
  async update(body) {
    const { id, ...data } = body;
    const res = await this.updateById(id, data);
    return res;
  }

  // 列表
  async list(cur = 1, pageSize = 10) {
    const page = Math.max(1, parseInt(cur));
    const limit = Math.min(pageSize, 100);
    const offset = (page - 1) * limit;

    const [{ count }] = await this.db(this.tableName).count("id as count");
    const list = await this.db(this.tableName)
      .select(
        "plus_gather.id",
        "plus_gather.taskName",
        "plus_gather.targetUrl",
        "plus_gather.parseData",
        "plus_gather.cid",
        "plus_gather.status",
        "plus_gather.createdAt",
        "plus_gather.updatedAt",
        "cms_category.name as category"
      )
      .innerJoin("cms_category", "plus_gather.cid", "cms_category.id")
      .limit(limit)
      .offset(offset)
      .orderBy("plus_gather.id", "desc");

    const total = Math.ceil(count / limit);

    const formattedList = Chan.helper.formatDateFields(list, ['createdAt', 'updatedAt', 'publishTime', 'startTime', 'endTime']);

    return {
      success: true,
      code: 200,
      msg: '查询成功',
      data: {
        count,
        total,
        current: page,
        list: formattedList,
      },
    };
  }

  // 查
  async detail(id) {
    const res = await this.findById(id, {
      fields: ["*"],
    });
    return res;
  }

  // 搜索
  async search(key = "", cur = 1, pageSize = 10) {
    const res = await this.query({
      current: cur,
      pageSize: pageSize,
      query: key ? { taskName: { like: `%${key}%` } } : {},
      fields: ["*"],
    });
    return res;
  }
}

export default new GatherService();
